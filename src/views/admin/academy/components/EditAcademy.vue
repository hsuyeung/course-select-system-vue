<template>
  <a-modal
    title="编辑学院"
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
       <!--输入学院名-->
      <a-form-model-item label="学院名" prop="academyName">
        <a-input v-model="data.academyName" />
      </a-form-model-item>
      <!-- 学院描述 -->
      <a-form-model-item label="学院描述" prop="academyDescription">
        <a-textarea type="textarea" v-model="data.academyDescription" />
      </a-form-model-item>
      <!--学校选择-->
      <a-form-model-item label="所属学校" prop="school">
        <a-tree-select
          style="width: 100%"
          :value="schoolSelected"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="请选择学院所属学校"
          allow-clear
          tree-default-expand-all
          @change="schoolSelectChange"
        >
          <a-tree-select-node
            v-for="item in schools"
            v-show="schoolSelected!==item.id"
            :key="item.id + item.schoolName"
            :value="item.id"
            :title="item.schoolName"
          >
          </a-tree-select-node>
        </a-tree-select>
      </a-form-model-item>
      <!--学院状态-->
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
import { updateAcademy } from "network/academy";
import responseCode from "network/responseCode";

export default {
  name: "EditAcademy",
  props: {
    schools: {
      //全部学校数据
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
      schoolSelected: undefined, //已经选择的学校信息
      confirmLoading: false, //确认按钮loading
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      rules: {
        //输入内容的校验规则
        academyName: [
          { required: true, message: "请输入学院名", trigger: "blur" },
        ],
        isDelete: [{ required: true, message: "请选择状态", trigger: "blur" }],
      },
    };
  },
  watch: {
    //监听data数据的变化，更新已选择的学校
    data(value) {
      this.schoolSelected=value.school.id;
    },
  },
  methods: {
    //学校选择发生变化
    schoolSelectChange(value) {
      console.log(value)
      this.schoolSelected=value;
    },
    //保存修改
    saveEdit() {
      this.$refs.ruleForm.validate((valid) => {
        //校验规则
        if (valid) {
          // 对学校信息整理
          let school = this.schools.filter((item) =>
             this.schoolSelected===item.id
          )[0];
          this.data.school = school;
          //设置确认按钮为加载状态
          this.confirmLoading = true;
          //调用更新学院信息的请求函数
          updateAcademy(this.data)
            .then((res) => {
              console.log(res)
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
