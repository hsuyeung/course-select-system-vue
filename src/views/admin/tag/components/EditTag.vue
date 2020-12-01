<template>
  <a-modal
    title="修改标签"
    :visible="visible"
    okText="保存"
    cancelText="取消"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @ok="save"
    @cancel="cancel"
  >
    <a-form-model
      ref="form"
      :model="data"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="标签名" prop="tagName">
        <a-input
          v-model="data.tagName"
        />
      </a-form-model-item>

      <a-form-model-item label="权重" prop="sequence">
        <a-input-number v-model="data.sequence" :step="1"/>
      </a-form-model-item>

      <a-form-model-item label="状态" prop="status">
        <!--状态-->
        <a-radio-group
          class="item"
          :value="data.status"
          button-style="solid"
        >
          <a-radio-button :value="0">
            正常
          </a-radio-button>
          <a-radio-button :value="1">
            删除
          </a-radio-button>
          <a-radio-button :value="2">
            审核中
          </a-radio-button>
          <a-radio-button :value="3">
            审核失败
          </a-radio-button>
        </a-radio-group>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
  import responseCode from "network/responseCode";
  import {updateTag} from "network/tag";

  export default {
    name:"EditTag",
    props: {
      "visible": {//编辑弹窗是否可见
        type: Boolean,
        default: false
      },
      "data": {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    data() {
      return {
        confirmLoading: false,//确认按钮loading
        labelCol: {span: 4},
        wrapperCol: {span: 20},
        rules: {
          tagName: [
            {required: true, message: '请输入标签名', trigger: 'blur'},
          ],
          sequence: [{required: true, message: '请输入标签序号', trigger: 'blur'}],
          status: [{required: true, message: '请选择状态', trigger: 'blur'}],
        },
      }
    },
    methods: {
      save() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.confirmLoading = true;
            this.data.sequence = parseInt(this.data.sequence);
            updateTag(this.data).then(res => {
              if (res.code === 20000) {
                this.$message.success({
                  content: "保存成功"
                })
                this.$emit("success")
              } else {
                responseCode(res.code, this);

              }
              this.confirmLoading = false;
            }).catch(err => {
              responseCode(-1, this)
              this.confirmLoading = false;
            })

          } else {
            return false;
          }
        });
      },
      //取消添加
      cancel() {
        this.confirmLoading = false;
        this.$emit('cancel');
      },
    }
  }
</script>

<style scoped>
  .item {
    margin-bottom: 15px;
  }
</style>
