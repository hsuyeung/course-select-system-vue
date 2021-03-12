<template>
  <a-modal
    title="编辑角色"
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
          <a-radio-button value="UNDELETED"> 启用 </a-radio-button>
          <a-radio-button value="DELETED"> 禁用 </a-radio-button>
        </a-radio-group>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { updateRole } from "network/system";
import responseCode from "network/responseCode";

export default {
  name: "EditRole",
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
    data: {
      //当前编辑的角色数据
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      authoritySelectedItems: [], //已经选择的权限信息
      confirmLoading: false, //确认按钮loading
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
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
  watch: {
    //监听data数据的变化，更新已选择的权限
    data(value) {
      this.authoritySelectedItems = value.authorities.map((item) => item.id);
    },
  },
  methods: {
    //权限选择发生变化
    authoritySelectChange(value) {
      this.authoritySelectedItems = value;
    },
    //保存修改
    saveEdit() {
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
          //调用更新角色信息的请求函数
          updateRole(this.data)
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
    // 取消编辑角色信息
    editCancel() {
      //触发取消事件
      this.$emit("cancel");
    },
  },
};
</script>

<style scoped>
</style>
