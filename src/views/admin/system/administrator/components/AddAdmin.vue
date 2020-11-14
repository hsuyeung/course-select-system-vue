<template>
  <a-modal
    title="添加管理员"
    :visible="visible"
    okText="添加"
    cancelText="取消"
    class="edit-panel"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @ok="saveAdd"
    @cancel="addCancel"
  >
    <!--      用户名修改-->
    <a-input
      class="item"
      addonBefore="用户名"
      :value="data.username"
      @change="editUsername"
    />
    <!--      邮箱-->
    <a-input
      class="item"
      addonBefore="邮箱"
      :value="data.email"
      @change="editEmail"
    />
    <!--      角色选择-->

    <a-tree-select
      style="width: 100%"
      :value="roleSelectedItems"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      placeholder="请选择管理员角色"
      allow-clear
      multiple
      class="item"
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
    <!--状态-->
    <a-radio-group
      class="item"
      button-style="solid"
      :value="data.status"
      @change="changeStatus"
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
  </a-modal>
</template>

<script>
  import {addAdmin} from "network/system";
  import responseCode from "network/responseCode";
  export default {
    name: "AddAdmin",
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
    },
    data() {
      return {
        data: {},//当前操作的管理员数据（添加或修改）
        roleSelectedItems: [],//已经选择的角色信息
        confirmLoading: false,//确认按钮loading
      }
    },
    watch:{
      visible(value){
        this.data = {status:0};
        this.roleSelectedItems = []
      }
    },
    methods: {
      //取消添加
      addCancel() {
        this.$emit('cancel');
      },
      //编辑用户名
      editUsername(event) {
        this.data.username = event.target.value
      },
      //编辑邮箱
      editEmail(event) {
        this.data.email = event.target.value
      },
      //编辑密码
      editLoginPass(event) {
        this.data.loginPass = event.target.value
      },
      //状态改变
      changeStatus(event) {
        this.data.status = parseInt(event.target.value)
      },
      //角色选择发生变化
      roleSelectChange(value) {
        this.roleSelectedItems = value;
      },
      //添加管理员
      saveAdd() {
// 对角色信息整理
        let roles = this.roles.filter(item => this.roleSelectedItems.includes(item.id))
        this.data.roles = roles;
        //判断邮箱的格式
        const emailReg = new RegExp(/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/);
        if (!emailReg.test(this.data.email)) {
          this.$message.warning({
            content: "邮箱格式不正确"
          })
          return;
        }
        this.confirmLoading = true;
        addAdmin(this.data).then(res => {
          if (res.code === 20000) {
            this.$message.success({
              content: "添加成功",
            });
            // 触发添加成功的事件
            this.$emit('success')
          } else {
            responseCode(res.code, this)
          }

        }).catch(err => {
          responseCode(-1, this)
        })
        this.confirmLoading = false;
      },
    }
  }
</script>

<style scoped>
  .item {
    margin-bottom: 15px;
  }
</style>
