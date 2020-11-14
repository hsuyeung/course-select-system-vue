<template>
  <div class="page login-page">
    <div class="container d-flex align-items-center">
      <div class="form-holder has-shadow">
        <div class="row">
          <!-- Logo & Information Panel-->
          <div class="col-lg-6">
            <div class="info d-flex align-items-center">
              <div class="content">
                <div class="logo">
                  <h1>欢迎登录</h1>
                </div>
                <h3 class="title">博客管理系统</h3>
              </div>
            </div>
          </div>
          <!-- Form Panel    -->
          <div class="col-lg-6 bg-white">
            <div class="form d-flex align-items-center">
              <div class="content">
                <div class="form-group">
                  <input id="login-username" v-model="name" type="text" placeholder="请输入用户名"
                         class="input-material" @keyup.enter="login">
                </div>
                <div class="form-group">
                  <input id="login-password" v-model="password" type="password" placeholder="请输入密码"
                         class="input-material" @keyup.enter="login">
                </div>
                <a-button type="primary" block @click="login" :disabled="loginBtnDisabled">登录</a-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {login} from "network/login";//引入登录请求的方法
  import {setCookie} from "common/cookie";
  import router from "../../router"
  //引入cookie相关的方法


  export default {
    name: "index",
    data() {
      return {
        name: "",//用户名
        password: "",//密码
        loginBtnDisabled: false,//登录按钮是否禁用
      }
    },
    methods: {
      //登录事件
      login() {

        //判断用户名和密码是否填写
        if (this.name == "" || this.name == undefined) {
          this.$message.warning("请输入用户名")
        } else if (this.password == "" || this.password == undefined) {
          this.$message.warning("请输入密码")
        } else {
          //显示正在登录的提示信息
          this.$message.loading({
            content: "登录中",
            duration: 0
          });
          // 设置登录按钮为不可点击
          this.loginBtnDisabled = true;

          // 调用登录请求的方法
          login(this.name, this.password).then(res => {
            console.log(res)
            //销毁全局消息提示
            this.$message.destroy();
            // 设置登录按钮为可点击
            this.loginBtnDisabled = false;
            const {code,msg} = res;
            if (code == 20001) {
              // 保存token
              setCookie('token', res.token);

              // 遍历管理员权限
              let roleArr = [];
              res.admin.roles.forEach(value => {
                roleArr.push(value.roleName)
              });
              setCookie('role', roleArr);
              // 保存管理员用户名
              setCookie('username', res.admin.username);
              this.$message.success({
                content: "登录成功",
                onClose: () => {
                  this.$router.replace({name: 'Admin'})
                }
              })
            } else {
              this.$message.error(msg)
            }
          }).catch(err => {
            // 销毁所有消息提示
            this.$message.destroy();
            // 错误提示
            this.$message.error("登录请求发生错误");
            this.loginBtnDisabled = false;
          })


        }
      }
    },
    created() {
      // 全局设置提示配置
      this.$message.config({
        top: `300px`,
        duration: 1,
        maxCount: 3,
      });
    }
  }
</script>

<style scoped>
  @import "https://www.jq22.com/jquery/bootstrap-4.2.1.css";

  .login-page {
    position: relative;
  }

  .title {
    font-size: 3.5rem;
  }

  .login-page::before {
    content: '';
    width: 100%;
    height: 100%;
    display: block;
    z-index: -1;
    background: url(~assets/img/p_big3.jpg);
    background-size: cover;
    -webkit-filter: blur(10px);
    filter: blur(10px);
    z-index: 1;
    position: absolute;
    top: 0;
    right: 0;
  }

  .login-page .container {
    min-height: 100vh;
    z-index: 999;
    padding: 20px;
    position: relative;
  }

  .login-page .form-holder {
    width: 100%;
    border-radius: 5px;
    overflow: hidden;
    margin-bottom: 50px;
  }

  .login-page .form-holder .info, .login-page .form-holder .form {
    min-height: 70vh;
    padding: 40px;
    height: 100%;
  }

  .login-page .form-holder div[class*='col-'] {
    padding: 0;
  }

  .login-page .form-holder .info {
    background: rgba(121, 106, 238, 0.9);
    color: #fff;
  }

  .login-page .form-holder .info h1 {
    font-size: 2.5em;
    font-weight: 600;
  }

  .login-page .form-holder .info p {
    font-weight: 300;
  }

  .login-page .form-holder .form .form-group {
    position: relative;
    margin-bottom: 30px;
  }

  .login-page .form-holder .form .content {
    width: 100%;
  }

  .login-page .form-holder .form form {
    width: 100%;
    max-width: 400px;
  }


  .login-page .form-holder .form small {
    color: #aaa;
  }

  .login-page .form-holder .form .terms-conditions label {
    cursor: pointer;
    color: #aaa;
    font-size: 0.9em;
  }


  @media (max-width: 991px) {
    .login-page .info, .login-page .form {
      min-height: auto !important;
    }

    .login-page .info {
      padding-top: 100px !important;
      padding-bottom: 100px !important;
    }
  }

  input.input-material {
    width: 100%;
    border: none;
    border-bottom: 1px solid #eee;
    padding: 10px 0;
  }


  input.input-material:focus {
    outline: none;
  }


</style>
