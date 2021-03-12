<template>
  <a-modal
    title="添加学生"
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
      <!-- 学号 -->
      <a-form-model-item label="学号" prop="account">
        <a-input v-model="data.account" />
      </a-form-model-item>
      <!--输入学生名-->
      <a-form-model-item label="学生姓名" prop="realName">
        <a-input v-model="data.realName" />
      </a-form-model-item>
      <!-- 手机号 -->
      <a-form-model-item label="手机号" prop="phoneNumber">
        <a-input v-model="data.phoneNUmber" />
      </a-form-model-item>
      <!-- 邮箱地址 -->
      <a-form-model-item label="邮箱地址" prop="email">
        <a-input v-model="data.email" />
      </a-form-model-item>
      <!-- 性别 -->
      <a-form-model-item label="性别" prop="gender">
        <a-radio-group button-style="solid" v-model="data.gender">
          <a-radio-button value="MALE"> 男 </a-radio-button>
          <a-radio-button value="FEMALE"> 女 </a-radio-button>
        </a-radio-group>
      </a-form-model-item>
      <!-- 身份证号 -->
      <a-form-model-item label="身份证号" prop="idCardNo">
        <a-input v-model="data.idCardNo" />
      </a-form-model-item>
      <!-- 入学日期 -->
      <a-form-model-item label="入学日期" prop="enrollmentDate">
        <a-date-picker v-model="data.enrollmentDate" />
      </a-form-model-item>
      <!-- 班级 -->
      <a-form-model-item label="班级" prop="classNo">
        <a-input v-model="data.classNo" />
      </a-form-model-item>
      <!--专业选择-->
      <a-form-model-item label="所属专业" prop="major">
        <a-tree-select
          style="width: 100%"
          :value="majorSelected"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="请选择学生所属专业"
          allow-clear
          tree-default-expand-all
          @change="majorSelectChange"
        >
          <a-tree-select-node
            v-for="item in majors"
            v-show="majorSelected !== item.id"
            :key="item.id + item.majorName"
            :value="item.id"
            :title="item.majorName"
          >
          </a-tree-select-node>
        </a-tree-select>
      </a-form-model-item>
      <!--学生账号状态-->
      <a-form-model-item label="状态" prop="isDelete">
        <!--状态-->
        <a-radio-group button-style="solid" v-model="data.isDelete">
          <a-radio-button :value="0"> 正常 </a-radio-button>
          <a-radio-button :value="1"> 禁用 </a-radio-button>
        </a-radio-group>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { addStudent } from "network/student";
import responseCode from "network/responseCode";
import moment from "moment";

export default {
  name: "AddStudent",
  props: {
    majors: {
      //全部专业数据
      type: Array,
      default: () => {
        return [];
      },
    },
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
      data: {}, //当前操作的学生数据（添加或修改）
      majorSelected: [], //已经选择的专业信息
      confirmLoading: false, //确认按钮loading
      rules: {
        //输入内容的校验规则
        account: [
          { required: true, message: "请输入学生学号", trigger: "blur" },
        ],
        realName: [
          { required: true, message: "请输入学生姓名", trigger: "blur" },
        ],
        idCardNo: [
          { required: true, message: "请输入学生身份证号", trigger: "trigger" },
        ],
        gender: [
          { required: true, message: "请选择学生性别", trigger: "trigger" },
        ],
        enrollmentDate: [
          { required: true, message: "请输入学生入学时间", trigger: "trigger" },
        ],
        classNo: [
          { required: true, message: "请输入学生班级号", trigger: "trigger" },
        ],
        isDelete: [
          { required: true, message: "请选择账号状态", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    //取消添加
    addCancel() {
      this.data = {};
      this.$emit("cancel");
    },
    //专业选择发生变化
    majorSelectChange(value) {
      this.majorSelected = value;
    },
    //添加学生
    saveAdd() {
      this.$refs.ruleForm.validate((valid) => {
        //校验规则
        if (valid) {
          this.data.enrollmentDate = moment(this.data.enrollmentDate).format("YYYY-MM-DD");
          // 对专业信息整理
          let major = this.majors.filter(
            (item) => this.majorSelected === item.id
          )[0];
          this.data.major = major;
          //设置确认按钮为加载状态
          this.confirmLoading = true;
          //发送添加请求
          addStudent(this.data)
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
