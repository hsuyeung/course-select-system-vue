<template>
  <a-modal
    title="修改分类"
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
      <a-form-model-item label="分类名" prop="categoryName">
        <a-input
          v-model="data.categoryName"
        />
      </a-form-model-item>

      <a-form-model-item label="权重" prop="sequence">
        <a-input-number v-model="data.sequence" :step="1"/>
      </a-form-model-item>

      <a-form-model-item v-if="isSuperAdmin" label="状态" prop="status">
        <!--状态-->
        <a-radio-group
          class="item"
          :value="`${data.status}`"
          button-style="solid"
          @change="changeStatus"
        >
          <a-radio-button value="0">
            正常
          </a-radio-button>
          <a-radio-button value="1">
            删除
          </a-radio-button>
          <a-radio-button value="2">
            审核中
          </a-radio-button>
          <a-radio-button value="3">
            审核失败
          </a-radio-button>
        </a-radio-group>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
  import responseCode from "network/responseCode";
  import {updateCategory} from "network/category";

  export default {
    name: "AddCategory",
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
      },
      "isSuperAdmin":{
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        confirmLoading: false,//确认按钮loading
        labelCol: {span: 4},
        wrapperCol: {span: 20},
        rules: {
          categoryName: [
            {required: true, message: '请输入分类名', trigger: 'blur'},
          ],
          sequence: [{required: true, message: '请输入分类序号', trigger: 'blur'}],
          status: [{required: true, message: '请选择状态', trigger: 'blur'}],
        },
      }
    },
    methods: {
      //状态改变
      changeStatus(event) {
        this.data.status = parseInt(event.target.value)
      },
      save() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.confirmLoading = true;
            this.data.sequence = parseInt(this.data.sequence);
            updateCategory(this.data).then(res => {
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
