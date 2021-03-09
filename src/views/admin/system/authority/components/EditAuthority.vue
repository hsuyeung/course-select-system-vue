<template>
  <a-modal
    title="编辑权限"
    :visible="visible"
    okText="保存"
    cancelText="取消"
    class="edit-panel"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @ok="saveEdit"
    @cancel="editCancel"
  >
    <a-form-model
      ref="ruleForm"
      :model="data"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="权限名" prop="name">
        <a-input v-model="data.name" />
      </a-form-model-item>
      <a-form-model-item label="权限路径" prop="url">
        <a-input v-model="data.url" />
      </a-form-model-item>
      <a-form-model-item label="权限描述" prop="authorityDescription">
        <a-input v-model="data.authorityDescription" />
      </a-form-model-item>
      <!--权限状态-->
      <a-form-model-item label="状态" prop="isDelete">
        <!--状态-->
        <a-radio-group button-style="solid" v-model="data.isDelete">
          <a-radio-button :value="0"> 启用 </a-radio-button>
          <a-radio-button :value="1"> 禁用 </a-radio-button>
        </a-radio-group>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { updateAuthority } from "network/system";
import responseCode from "network/responseCode";

export default {
  name: "EditAuthority",
  props: {
    visible: {
      //编辑弹窗是否可见
      type: Boolean,
      default: false,
    },
    data: {
      //当前编辑的权限数据
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      confirmLoading: false, //确认按钮loading
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      rules: {
        name: [
          { required: true, message: "请输入权限名", trigger: "blur" },
        ],
        url: [
          { required: true, message: '请输入权限路径', trigger: 'blur' }
        ],
        isDelete: [
          { required: true, message: '请选择权限状态', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    //保存修改
    saveEdit() {
      this.$refs.ruleForm.validate((valid) => {
        //校验规则
        if (valid) {
          //设置确认按钮为加载状态
          this.confirmLoading = true;
          //调用更新角色信息的请求函数
          updateAuthority(this.data)
            .then((res) => {
              console.log(res);
              if (res.code === 20000) {
                //判断状态码
                this.$message.success({
                  content: "保存成功",
                });
                //发送保存成功的事件
                this.$emit("success");
              } else {
                responseCode(res.code, this);
              }
            })
            .catch((err) => {
              responseCode(-1, this);
            });
          //取消确认按钮加载状态
          this.confirmLoading = false;
        }
      });
    },
    // 取消编辑权限信息
    editCancel() {
      //触发取消事件
      this.$emit("cancel");
    },
  },
};
</script>

<style scoped>
</style>
