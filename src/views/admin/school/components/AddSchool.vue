<template>
  <a-modal
    title="添加学校"
    :visible="visible"
    okText="添加"
    cancelText="取消"
    class="edit-panel"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @ok="saveAdd"
    @cancel="addCancel"
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
      <!--学校状态-->
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
import { addSchool } from "network/school";
import responseCode from "network/responseCode";

export default {
  name: "AddSchool",
  props: {
    visible: {
      //编辑弹窗是否可见
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      data: {}, //当前操作的学校数据（添加或修改）
      confirmLoading: false, //确认按钮loading
      rules: {
        //输入内容的校验规则
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
    //取消添加
    addCancel() {
      this.data = {};
      this.$emit("cancel");
    },
    //添加学校
    saveAdd() {
      this.$refs.ruleForm.validate((valid) => {
        //校验规则
        if (valid) {
          //设置确认按钮为加载状态
          this.confirmLoading = true;
          //发送添加请求
          addSchool(this.data)
            .then((res) => {
              //判断状态码
              if (res.code === 20000) {
                this.$message.success({
                  content: "添加成功",
                });
                // 触发添加成功的事件
                this.$emit("success");
              } else {
                responseCode(res.code, this);
              }
            })
            .catch((err) => {
              responseCode(-1, this);
            });
          //取消确认按钮的加载状态
          this.confirmLoading = false;
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.item {
  margin-bottom: 15px;
}
</style>
