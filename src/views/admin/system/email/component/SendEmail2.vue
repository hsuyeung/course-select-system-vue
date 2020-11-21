<template>
  <a-modal
    title="发邮件"
    :visible="visible"
    okText="发送"
    cancelText="取消"
    class="edit-panel"
    width="70%"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    ref="collectionForm"
    @ok="send"
    @cancel="cancel"
  >
    <a-form-model
      ref="emailForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <!--      TODO 对收件人的选择用选择器重写-->

      <a-form-model-item label="收件人" prop="to">
        <a-tree-select
          style="width: 100%"
          :value="roleSelectedItems"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="请选择收件人"
          allow-clear
          multiple
          class="item"
          tree-default-expand-all
          @change="roleSelectChange"
        >
          <a-tree-select-node v-for="item in roles" v-show="!roleSelectedItems.includes(item.id)"
                              :key="item.id+item.roleNameCN" :value="item.id" :title="item.roleNameCN">

          </a-tree-select-node>
        </a-tree-select>

      </a-form-model-item>
      <a-form-model-item label="收件人" prop="to">
        <a-input
          v-model="form.to"
          placeholder="请输入收件人邮箱地址，多个收件人用逗号隔开"
        />
      </a-form-model-item>

      <a-form-model-item label="主题" prop="subject">
        <a-input
          v-model="form.subject"
          placeholder="请输入邮件主题"
        />
      </a-form-model-item>

      <a-form-model-item label="内容" prop="text">
        <editor-md :value="form.text" placeholder="请输入邮件内容" :navigation="false" height="400px" @change="contentChange"/>
      </a-form-model-item>

      <a-form-model-item label="抄送" prop="cc">
        <a-input
          v-model="form.cc"
          placeholder="选填，多个抄送用逗号隔开"
        >
          <a-tooltip slot="addonAfter">
            <template slot="title">
              什么是抄送:同时将这一封邮件发送给其他联系人，抄送的人不需要办理邮件中的事项
            </template>
            <a-icon type="question-circle"/>
          </a-tooltip>
        </a-input>
      </a-form-model-item>
      <a-form-model-item label="密送" prop="bcc">
        <a-input
          v-model="form.bcc"
          placeholder="选填，多个密送用逗号隔开"
        >
          <a-tooltip slot="addonAfter">
            <template slot="title">
              什么是密送:同时将这一封邮件发送给其他联系人，但收件人及抄送人不会看到密送人。
            </template>
            <a-icon type="question-circle"/>
          </a-tooltip>
        </a-input>
      </a-form-model-item>

      <!--      附件-->
      <a-form-model-item label="附件" prop="files">
        <!--        文件选择框-->
        <a-upload-dragger
          :multiple="true"
          :file-list="form.files"
          :remove="handleRemove"
          :before-upload="beforeUpload"
        >
          <p class="ant-upload-drag-icon">
            <a-icon type="inbox"/>
          </p>
          <p class="ant-upload-content">
            点击或拖拽文件到这里
          </p>
          <p class="ant-upload-hint">
            支持单个或批量上传
          </p>
        </a-upload-dragger>
      </a-form-model-item>
      <a-form-model-item label="重置">
        <a-button @click="resetForm" type="danger">清空邮件内容</a-button>
      </a-form-model-item>


    </a-form-model>
  </a-modal>
</template>

<script>
  import {sendEmail} from "network/system";//发邮件的组件
  import responseCode from "network/responseCode";
  import EditorMd from "components/EditorMd/EditorMd";

  export default {
    components: {
      EditorMd
    },
    props: {
      "visible": {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        roles:[],
        roleSelectedItems: [],//已经选择的角色信息
        confirmLoading: false,
        labelCol: {span: 3},
        wrapperCol: {span: 20},
        form: {
          to: '',
          subject: "",
          text: '',
          cc: '',
          bcc: '',
          files: [],
        },
        rules: {
          to: [
            {required: true, message: '请输入收件人', trigger: 'blur'},
          ],
          subject: [
            {required: true, message: '请输入主题', trigger: 'blur'},
          ],
          text: [{required: true, message: '请输入邮件内容', trigger: 'blur'}],
        },
      }
    },
    methods: {
      //角色选择发生变化
      roleSelectChange(value) {
        this.roleSelectedItems = value;
      },
      //邮件内容变化
      contentChange(value, html) {
        this.form.text = html;
      },
      //附件删除
      handleRemove(file) {
        const index = this.form.files.indexOf(file);
        const newFileList = this.form.files.slice();
        newFileList.splice(index, 1);
        this.form.files = newFileList;
      },
      //阻止默认的上传，将文件保存到data里面
      beforeUpload(file) {
        this.form.files = [...this.form.files, file];
        return false;
      },
      //发送邮件
      send() {
        this.$refs.emailForm.validate(valid => {
          if (valid) {
            this.confirmLoading = true;
            let formData = new FormData();
            Object.keys(this.form).forEach(key => {
              if (key === 'files') {
                this.form[key].forEach(file => {
                  formData.append('files', file);
                })
              } else {
                formData.append(key, this.form[key]);
              }

            });
            sendEmail(formData).then(res => {
              if (res.code === 20000) {
                this.$message.success({
                  content: "发送成功"
                })
                this.$emit('success')
              } else {
                responseCode(res.code, this);
              }
            }).catch(err => {
              responseCode(-1, this);
            })
            this.confirmLoading = false

          } else {
            return false;
          }
        });
      },
      cancel() {

        this.$emit('cancel')
      },
      resetForm() {
        this.$confirm({
          title: '确认清空邮件内容吗？',
          content: "确认将清空已输入的全部邮件内容",
          centered: true,
          onOk: () => {
            this.$refs.emailForm.resetFields();
            this.form.text = ""
          }
        });

      }
    }
  }
</script>

<style scoped>

</style>
