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
    <!--      密码-->
    <a-input-password
      placeholder="不修改密码请不要输入任何内容"
      class="item"
      addonBefore="密码"
      :value="data.loginPass"
      @change="editLoginPass"
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
      <a-tree-select-node v-for="item in roles" v-show="!roleSelectedItems.includes(item.id)"
                          :key="item.id+item.roleNameCN" :value="item.id" :title="item.roleNameCN">

      </a-tree-select-node>
    </a-tree-select>
    <!--状态-->
    <a-radio-group
      class="item"
      :value="`${data.status}`"
      button-style="solid"
      @change="changeStatus"
    >
      <a-radio-button value="0">
        正常
      </a-radio-button>
      <a-radio-button value="1">
        冻结
      </a-radio-button>
      <a-radio-button value="2">
        删除
      </a-radio-button>
    </a-radio-group>
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
      "data":{//当前编辑的管理员数据
        type:Object,
        default:()=>{
          return {}
        }
      }
    },
    data() {
      return {
        roleSelectedItems: [],//已经选择的角色信息
        confirmLoading: false,//确认按钮loading
      }
    },
    watch:{
      //监听data数据的变化，更新已选择的角色
      data(value){
        this.roleSelectedItems = value.roles.map(item => item.id);
      }
    },
    methods: {
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
      //保存修改
      saveEdit() {
        // 对角色信息整理
        let roles = this.roles.filter(item => this.roleSelectedItems.includes(item.id))
        this.data.roles = roles;

        //判断密码的格式
        const passwordReg = new RegExp(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/)
        if (this.data.loginPass != '' && !passwordReg.test(this.data.loginPass)) {//判断密码不为空且不符合要求，就警告提示
          this.$message.warning({
            content: "密码格式有误"
          })
          this.confirmLoading = false;
          return;
        }

        //判断邮箱的格式
        const emailReg = new RegExp(/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/);
        if (!emailReg.test(this.data.email)) {
          this.$message.warning({
            content: "邮箱格式不正确"
          })
          this.confirmLoading = false;
          return;
        }
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
        })
        this.confirmLoading = false;

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
  .item {
    margin-bottom: 15px;
  }
</style>
