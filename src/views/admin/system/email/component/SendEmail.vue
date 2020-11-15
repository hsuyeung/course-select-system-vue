<template>
  <a-modal
    title="发邮件"
    :visible="visible"
    okText="发送"
    cancelText="取消"
    class="edit-panel"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    ref="collectionForm"
    @ok="ok"
    @cancel="cancel"
  >
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
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
        <a-input
          v-model="form.text"
          type="textarea"
          placeholder="请输入邮件内容"
        />
      </a-form-model-item>

      <a-form-model-item label="抄送" prop="cc">
        <a-input
          v-model="form.cc"
          placeholder="选填"
        >
          <a-tooltip slot="addonAfter">
            <template slot="title">
              什么是抄送:同时将这一封邮件发送给其他联系人。
            </template>
            <a-icon type="question-circle"/>
          </a-tooltip>
        </a-input>
      </a-form-model-item>
      <a-form-model-item label="密送" prop="bcc">
        <a-input
          v-model="form.bcc"
          placeholder="选填"
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

    </a-form-model>
  </a-modal>
</template>

<script>
  import {sendEmail} from "network/system";
  import responseCode from "network/responseCode";

  const formItemLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 20},
  };
  export default {
    name: "SendEmail",
    props: {
      "visible": {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        confirmLoading: false,
        labelCol: {span: 3},
        wrapperCol: {span: 21},
        other: '',
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
      handleRemove(file) {
        const index = this.form.files.indexOf(file);
        const newFileList = this.form.files.slice();
        newFileList.splice(index, 1);
        this.form.files = newFileList;
      },
      beforeUpload(file) {
        this.form.files = [...this.form.files, file];
        return false;
      },
      ok() {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.confirmLoading = true;
            let formData = new FormData();
            Object.keys(this.form).forEach(key => {
              formData.append(key, this.form[key]);
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
        this.$refs.ruleForm.resetFields();
        this.$emit('cancel')
      },
    }
  }
</script>

<style scoped>

</style>
