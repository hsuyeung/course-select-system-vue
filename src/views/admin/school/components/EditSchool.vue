<template>
  <a-modal
    title="编辑学校"
    :visible="visible"
    okText="保存"
    cancelText="取消"
    class="edit-panel"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @ok="saveEdit"
    @cancel="editCancel"
    style="width:500px"
  >
    <a-form-model
      ref="ruleForm"
      :model="data"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="学校名" prop="schoolName">
        <a-input v-model="data.schoolName" />
      </a-form-model-item>
      <a-form-model-item label="学校描述" prop="schoolDescription">
        <a-textarea type="textarea" v-model="data.schoolDescription" />
      </a-form-model-item>
      <!--权限状态-->
      <a-form-model-item label="状态" prop="isDelete">
        <!--状态-->
        <a-radio-group button-style="solid" v-model="data.isDelete">
          <a-radio-button :value="0"> 正常 </a-radio-button>
          <a-radio-button :value="1"> 已删除 </a-radio-button>
        </a-radio-group>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { updateSchool } from "network/school";
import responseCode from "network/responseCode";

export default {
  name: "EditSchool",
  props: {
    visible: {
      //编辑弹窗是否可见
      type: Boolean,
      default: false,
    },
    data: {
      //当前编辑的学校数据
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
        schoolName: [
          { required: true, message: "请输入学校名", trigger: "blur" },
        ],
        isDelete: [
          { required: true, message: '请选择学校状态', trigger: 'blur' }
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
          updateSchool(this.data)
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
