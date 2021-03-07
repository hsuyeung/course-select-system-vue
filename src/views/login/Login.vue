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
                <h3 class="title">高校选课系统</h3>
              </div>
            </div>
          </div>
          <!-- Form Panel -->
          <div class="col-lg-6 bg-white">
            <div class="form d-flex align-items-center">
              <div class="content">
                <div class="form-group">
                  <input
                    id="login-account"
                    v-model="account"
                    type="text"
                    :placeholder="hintMsg"
                    class="input-material"
                    @keyup.enter="login"
                  />
                </div>
                <div class="form-group">
                  <input
                    id="login-password"
                    v-model="password"
                    type="password"
                    placeholder="请输入密码"
                    class="input-material"
                    @keyup.enter="login"
                  />
                </div>
                <div style="margin-bottom: 20px">
                  <div>
                    <a-radio-group v-model="loginType" @change="onChange">
                      <a-radio :value="'0'" class="col-sm-12 col-lg-3">
                        学生登录
                      </a-radio>
                      <a-radio :value="'1'" class="col-sm-12 col-lg-3">
                        教师登录
                      </a-radio>
                      <a-radio :value="'2'" class="col-sm-12 col-lg-3">
                        管理员登录
                      </a-radio>
                    </a-radio-group>
                  </div>
                </div>
                <a-button
                  type="primary"
                  block
                  @click="login"
                  :disabled="loginBtnDisabled"
                  >登录</a-button
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from "network/login"; //引入登录请求的方法
import { setCookie } from "common/cookie";
import router from "../../router";
//引入cookie相关的方法

export default {
  name: "index",
  data() {
    return {
      // 登录账号
      account: "",
      // 密码
      password: "",
      // 登录按钮是否禁用
      loginBtnDisabled: false,
      // 登录类型，默认为 '0'（学生登录）
      loginType: "0",
      // 账号输入框的提示信息
      hintMsg: "可使用学号/手机号/邮箱进行登录",
    };
  },
  methods: {
    // 登录事件
    login() {
      // 判断用户名和密码是否填写
      if (this.account == "" || this.account == undefined) {
        this.$message.warning("请输入用户名");
      } else if (this.password == "" || this.password == undefined) {
        this.$message.warning("请输入密码");
      } else {
        // 显示正在登录的提示信息
        this.$message.loading({
          content: "登录中...",
          duration: 0,
        });
        // 设置登录按钮为不可点击
        this.loginBtnDisabled = true;
        // 调用登录请求的方法
        login(this.account, this.password, this.loginType)
          .then((res) => {
            // 销毁全局消息提示
            this.$message.destroy();
            // 设置登录按钮为可点击
            this.loginBtnDisabled = false;
            const { code, msg } = res;
            console.log(res);
            if (code == 20001) {
              // 保存token
              setCookie("token", res.token);
              if (this.loginType == '2') {
                // 遍历管理员权限
                let roleArr = [];
                res.info.roles.forEach((role) => {
                  roleArr.push(role.roleName);
                });
                setCookie('role', roleArr);
                // 保存管理员用户名
                setCookie('username', res.info.username);
              }
              setCookie('username', res.info.account);
              // 保存账号类型，用于之后做判断
              setCookie('loginType', this.loginType);
              this.$message.success({
                content: "登录成功",
                onClose: () => {
                  this.$router.replace({ name: "Admin" });
                },
              });
            } else {
              this.$message.error(msg);
            }
          })
          .catch((err) => {
            // 销毁所有消息提示
            this.$message.destroy();
            // 错误提示
            this.$message.error("登录请求发生错误");
            this.loginBtnDisabled = false;
          });
      }
    },
    // 切换登录类型
    onChange(e) {
      switch (e.target.value) {
        case "0":
          this.hintMsg = "可使用学号/手机号/邮箱进行登录";
          break;
        case "1":
          this.hintMsg = "可使用工号/手机号/邮箱进行登录";
          break;
        case "2":
          this.hintMsg = "请输入管理员用户名进行登录";
          break;
      }
    },
  },
  created() {
    // 全局设置提示配置
    this.$message.config({
      top: `300px`,
      duration: 1,
      maxCount: 3,
    });
  },
};
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
  content: "";
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

.login-page .form-holder .info,
.login-page .form-holder .form {
  min-height: 70vh;
  padding: 40px;
  height: 100%;
}

.login-page .form-holder div[class*="col-"] {
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
  .login-page .info,
  .login-page .form {
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
