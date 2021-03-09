<template>
  <a-modal
    title="添加角色"
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
      <a-form-model-item label="角色名" prop="roleName">
        <a-input v-model="data.roleName" />
      </a-form-model-item>
      <a-form-model-item label="角色描述" prop="roleDescription">
        <a-input v-model="data.roleDescription" />
      </a-form-model-item>
      <!--权限选择-->
      <a-form-model-item label="角色权限" prop="authorities">
        <a-tree-select
          style="width: 100%"
          :value="authoritySelectedItems"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="请选择角色权限"
          allow-clear
          multiple
          tree-default-expand-all
          @change="authoritySelectChange"
        >
          <a-tree-select-node
            v-for="item in authorities"
            v-show="!authoritySelectedItems.includes(item.id)"
            :key="item.id + item.name"
            :value="item.id"
            :title="item.name"
          >
          </a-tree-select-node>
        </a-tree-select>
      </a-form-model-item>
      <!--角色状态-->
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
import { addRole } from "network/system";
import responseCode from "network/responseCode";

export default {
  name: "AddRole",
  props: {
    authorities: {
      //全部权限数据
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
      data: {}, //当前操作的角色数据（添加或修改）
      authoritySelectedItems: [], //已经选择的权限信息
      confirmLoading: false, //确认按钮loading
      rules: {
        //输入内容的校验规则
        roleName: [
          { required: true, message: "请输入角色名", trigger: "blur" },
        ],
        isDelete: [
          { required: true, message: '请选择角色状态', trigger: 'blur' }
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
    //权限选择发生变化
    authoritySelectChange(value) {
      this.authoritySelectedItems = value;
    },
    //添加角色
    saveAdd() {
      this.$refs.ruleForm.validate((valid) => {
        //校验规则
        if (valid) {
          // 对权限信息整理
          let authorities = this.authorities.filter((item) =>
            this.authoritySelectedItems.includes(item.id)
          );
          this.data.authorities = authorities;
          //设置确认按钮为加载状态
          this.confirmLoading = true;
          //发送添加请求
          addRole(this.data)
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
