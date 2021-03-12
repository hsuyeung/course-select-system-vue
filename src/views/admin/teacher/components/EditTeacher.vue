<template>
  <a-modal
    title="编辑教师"
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
      <!-- 工号 -->
      <a-form-model-item label="工号" prop="account">
        <a-input v-model="data.account" />
      </a-form-model-item>
      <!--输入教师名-->
      <a-form-model-item label="教师姓名" prop="realName">
        <a-input v-model="data.realName" />
      </a-form-model-item>
      <!-- 教师简介 -->
      <a-form-model-item label="教师简介" prop="teacherDescription">
       <a-textarea type="textarea" v-model="data.teacherDescription" />
      </a-form-model-item>
      <!-- 手机号 -->
      <a-form-model-item label="手机号" prop="phoneNumber">
        <a-input v-model="data.phoneNumber" />
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
      <!--学院选择-->
      <a-form-model-item label="所属学院" prop="academy">
        <a-tree-select
          style="width: 100%"
          :value="academySelected"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="请选择教师所属学院"
          allow-clear
          tree-default-expand-all
          @change="academySelectChange"
        >
          <a-tree-select-node
            v-for="item in academies"
            v-show="academySelected !== item.id"
            :key="item.id + item.academyName"
            :value="item.id"
            :title="item.academyName"
          >
          </a-tree-select-node>
        </a-tree-select>
      </a-form-model-item>
      <!--教师账号状态-->
      <a-form-model-item label="状态" prop="isDelete">
        <!--状态-->
        <a-radio-group button-style="solid" v-model="data.isDelete">
          <a-radio-button value="UNDELETED"> 正常 </a-radio-button>
          <a-radio-button value="DELETED"> 已删除 </a-radio-button>
        </a-radio-group>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { updateTeacher } from "network/teacher";
import responseCode from "network/responseCode";

export default {
  name: "EditTeacher",
  props: {
    academies: {
      //全部学院数据
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
    data: {
      //当前编辑的学院数据
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      academySelected: undefined, //已经选择的学院信息
      confirmLoading: false, //确认按钮loading
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      rules: {
        //输入内容的校验规则
        account: [
          { required: true, message: "请输入教师学号", trigger: "blur" },
        ],
        realName: [
          { required: true, message: "请输入教师姓名", trigger: "blur" },
        ],
        idCardNo: [
          { required: true, message: "请输入教师身份证号", trigger: "trigger" },
        ],
        gender: [
          { required: true, message: "请选择教师性别", trigger: "trigger" },
        ],
        isDelete: [
          { required: true, message: "请选择账号状态", trigger: "blur" },
        ],
      },
    };
  },
  watch: {
    //监听data数据的变化，更新已选择的学院
    data(value) {
      this.academySelected = value.academy.id;
    },
  },
  methods: {
    //学院选择发生变化
    academySelectChange(value) {
      console.log(value);
      this.academySelected = value;
    },
    //保存修改
    saveEdit() {
      this.$refs.ruleForm.validate((valid) => {
        //校验规则
        if (valid) {
          // 对学院信息整理
          let academy = this.academies.filter(
            (item) => this.academySelected === item.id
          )[0];
          this.data.academy = academy;
          //设置确认按钮为加载状态
          this.confirmLoading = true;
          //调用更新教师信息的请求函数
          updateTeacher(this.data)
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
    // 取消编辑学院信息
    editCancel() {
      //触发取消事件
      this.$emit("cancel");
    },
  },
};
</script>

<style scoped>
</style>
