<template>
  <a-modal
    title="添加专业"
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
      <!--输入专业名-->
      <a-form-model-item label="专业名" prop="majorName">
        <a-input v-model="data.majorName" />
      </a-form-model-item>
      <!-- 专业描述 -->
      <a-form-model-item label="专业描述" prop="majorDescription">
        <a-textarea type="textarea" v-model="data.majorDescription" />
      </a-form-model-item>
      <!--学院选择-->
      <a-form-model-item label="所属学院" prop="academy">
        <a-tree-select
          style="width: 100%"
          :value="academySelected"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="请选择专业所属学院"
          allow-clear
          tree-default-expand-all
          @change="academySelectChange"
        >
          <a-tree-select-node
            v-for="item in academies"
            v-show="academySelected!==item.id"
            :key="item.id + item.academyName"
            :value="item.id"
            :title="item.academyName"
          >
          </a-tree-select-node>
        </a-tree-select>
      </a-form-model-item>
      <!--专业状态-->
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
import { addMajor } from "network/major";
import responseCode from "network/responseCode";

export default {
  name: "AddMajor",
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
  },
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      data: {}, //当前操作的专业数据（添加或修改）
      academySelected: [], //已经选择的学院信息
      confirmLoading: false, //确认按钮loading
      rules: {
        //输入内容的校验规则
        majorName: [
          { required: true, message: "请输入专业名", trigger: "blur" },
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
    //学院选择发生变化
    academySelectChange(value) {
      this.academySelected = value;
    },
    //添加专业
    saveAdd() {
      this.$refs.ruleForm.validate((valid) => {
        //校验规则
        if (valid) {
          // 对学院信息整理
          let academy = this.academies.filter((item) =>
            this.academySelected===item.id
          )[0];
          this.data.academy = academy;
          //设置确认按钮为加载状态
          this.confirmLoading = true;
          //发送添加请求
          addMajor(this.data)
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
