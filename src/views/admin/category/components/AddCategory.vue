<template>
  <a-modal
    title="添加分类"
    :visible="visible"
    okText="添加"
    cancelText="取消"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @ok="saveAdd"
    @cancel="addCancel"
  >
    <a-form-model
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="分类名" prop="categoryName">
        <a-input
          v-model="form.categoryName"
        />
      </a-form-model-item>
      <a-form-model-item label="权重" prop="sequence">
        <a-input-number v-model="form.sequence" :step="1"/>
      </a-form-model-item>

      <a-form-model-item v-if="isSuperAdmin" label="状态" prop="status">
        <!--状态-->
        <a-radio-group
          class="item"
          v-model="form.status"
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
  import {addCategory} from "network/category";
  import {getCookie} from "../../../../common/cookie";

  export default {
    name: "AddCategory",
    props: {
      "visible": {//编辑弹窗是否可见
        type: Boolean,
        default: false
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
        form: {
          categoryName: '',
          sequence: 0,
          status:2
        },
        rules: {
          categoryName: [
            {required: true, message: '请输入分类名', trigger: 'blur'},
          ],
          sequence: [{required: true, message: '请输入分类序号', trigger: 'blur'}],
        },
      }
    },

    methods: {
      saveAdd() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.confirmLoading = true;
            this.form.sequence = parseInt(this.form.sequence);
            addCategory(this.form).then(res => {
              if (res.code === 20000) {
                this.$message.success({
                  content: "添加成功"
                });
                this.$emit("success")
              } else {
                responseCode(res.code, this)
              }
              this.confirmLoading = false;
            }).catch(err => {
              responseCode(-1, this)
              this.confirmLoading = false;
            });

          } else {
            return false;
          }
        });
      },
      //取消添加
      addCancel() {
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
