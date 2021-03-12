<template>
  <a-modal
    title="添加学院"
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
          <a-radio-button :value="0"> 正常 </a-radio-button>
          <a-radio-button :value="1"> 已删除 </a-radio-button>
        </a-radio-group>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { addAcademy } from "network/academy";
import responseCode from "network/responseCode";

export default {
  name: "AddAcademy",
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
  },
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      data: {}, //当前操作的学院数据（添加或修改）
      schoolSelected: [], //已经选择的学校信息
      confirmLoading: false, //确认按钮loading
      rules: {
        //输入内容的校验规则
        academyName: [
          { required: true, message: "请输入学院名", trigger: "blur" },
        ],
        isDelete: [{ required: true, message: "请选择状态", trigger: "blur" }]
      },
    };
  },
  methods: {
    //取消添加
    addCancel() {
      this.data = {};
      this.$emit("cancel");
    },
    //学校选择发生变化
    schoolSelectChange(value) {
      this.schoolSelected = value;
    },
    //添加学院
    saveAdd() {
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
          //发送添加请求
          addAcademy(this.data)
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
