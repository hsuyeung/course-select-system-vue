<template>
  <a-modal
    title="添加课程分类"
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
      <a-form-model-item label="课程分类" prop="courseCategoryName">
        <a-input v-model="data.courseCategoryName" />
      </a-form-model-item>
      <!--课程分类状态-->
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
import { addCourseCategory } from "network/course";
import responseCode from "network/responseCode";

export default {
  courseCategoryName: "AddCourseCategory",
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
      data: {}, //当前操作的课程分类数据（添加或修改）
      confirmLoading: false, //确认按钮loading
      rules: {
        //输入内容的校验规则
        courseCategoryName: [
          { required: true, message: "请输入课程分类名", trigger: "blur" },
        ],
        isDelete: [
          { required: true, message: '请选择课程分类状态', trigger: 'blur' }
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
    //添加课程分类
    saveAdd() {
      this.$refs.ruleForm.validate((valid) => {
        //校验规则
        if (valid) {
          //设置确认按钮为加载状态
          this.confirmLoading = true;
          //发送添加请求
          addCourseCategory(this.data)
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
