<template>
  <div>
    <div>
      <a-button type="primary" @click="showEmailPanel">发邮件</a-button>
    </div>
    <send-email :visible="emailPanelVisible" @cancel="()=>this.emailPanelVisible = false" @success="sendEmailSuccess"/>

  </div>
</template>

<script>
  import SendEmail from "./component/SendEmail";

  export default {
    name: "Email",
    components: {SendEmail},
    data() {
      return {
        emailPanelVisible: false,//发送邮件的弹窗是否显示
      }
    },
    methods: {
      // 显示发送邮件的弹窗
      showEmailPanel() {
        this.emailPanelVisible = true
      },
      // 邮件发送成功
      sendEmailSuccess(){
        this.emailPanelVisible = false;
      }
    }
  }
</script>

<style scoped>

</style>
