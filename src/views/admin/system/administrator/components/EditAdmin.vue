<template>
  <a-modal
    title="编辑管理员"
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
      <!--输入用户名-->
      <a-form-model-item label="用户名" prop="username">
        <a-input
          v-model="data.username"
        />
      </a-form-model-item>
      <!--输入邮箱-->
      <a-form-model-item label="邮箱" prop="email">
        <a-input
          v-model="data.email"
        />
      </a-form-model-item>
      <!--输入密码-->
      <a-form-model-item label="密码" prop="loginPass">
        <a-input-password
          placeholder="不修改密码请不要输入任何内容"
          v-model="data.loginPass"
        />
      </a-form-model-item>
      <!--角色权限选择-->
      <a-form-model-item label="权限角色" prop="roles">
        <a-tree-select
          style="width: 100%"
          :value="roleSelectedItems"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="请选择管理员角色"
          allow-clear
          multiple
          tree-default-expand-all
          @change="roleSelectChange"
        >
          <a-tree-select-node
            v-for="item in roles"
            v-show="!roleSelectedItems.includes(item.id)"
            :key="item.id+item.roleNameCN"
            :value="item.id"
            :title="item.roleNameCN"
          >
          </a-tree-select-node>
        </a-tree-select>
      </a-form-model-item>

      <!--管理员状态-->
      <a-form-model-item label="状态" prop="status">
        <!--状态-->
        <a-radio-group
          button-style="solid"
          v-model="data.status"
        >
          <a-radio-button :value="0">
            正常
          </a-radio-button>
          <a-radio-button :value="1">
            冻结
          </a-radio-button>
          <a-radio-button :value="2">
            删除
          </a-radio-button>
        </a-radio-group>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
  import {updateAdmin} from "network/system";
  import responseCode from "network/responseCode";

  export default {
    name: "EditAdmin",
    props: {
      "roles": {//全部角色数据
        type: Array,
        default: () => {
          return []
        }
      },
      "visible": {//编辑弹窗是否可见
        type: Boolean,
        default: false
      },
      "data": {//当前编辑的管理员数据
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    data() {
      return {
        roleSelectedItems: [],//已经选择的角色信息
        confirmLoading: false,//确认按钮loading
        labelCol: {span: 4},
        wrapperCol: {span: 20},
        rules: {//输入内容的校验规则
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {pattern: /^[A-Za-z][A-Za-z0-9-_]{5,17}$/, message: "用户名格式不正确", trigger: "blur"}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {pattern: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/, message: '邮箱格式不正确', trigger: 'blur'}
          ],
          loginPass: [
            {pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z!@#$%^&*()+=_-]{6,18}$/, message: '密码格式不正确', trigger: 'blur'}
          ],
          status: [{required: true, message: '请选择状态', trigger: 'blur'}],
        },
      }
    },
    watch: {
      //监听data数据的变化，更新已选择的角色
      data(value) {
        this.roleSelectedItems = value.roles.map(item => item.id);
      }
    },
    methods: {
      //角色选择发生变化
      roleSelectChange(value) {
        this.roleSelectedItems = value;
      },
      //保存修改
      saveEdit() {
        this.$refs.ruleForm.validate(valid => {//校验规则
          if (valid) {
            // 对角色信息整理
            let roles = this.roles.filter(item => this.roleSelectedItems.includes(item.id))
            this.data.roles = roles;
            //设置确认按钮为加载状态
            this.confirmLoading = true;
            //调用更新管理员信息的请求函数
            updateAdmin(this.data).then(res => {
              if (res.code === 20000) {//判断状态码
                this.$message.success({
                  content: "保存成功",
                });
                //发送保存成功的事件
                this.$emit('success');
              } else {
                responseCode(res.code, this)
              }
            }).catch(err => {
              responseCode(-1, this)
            });
            //取消确认按钮加载状态
            this.confirmLoading = false;
          }
        })
      },
      // 取消编辑管理员信息
      editCancel() {
        //触发取消事件
        this.$emit('cancel');
      },
    }
  }
</script>

<style scoped>

</style>
