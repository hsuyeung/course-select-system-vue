export default function responseCode(code, that) {

  switch (code) {
    case 10001:
      that.$message.error({
        content: "登录失败",
      });
      break;
    case 10002:
      that.$message.error({
        content: "注销失败",
      });
      break;
    case 10003:
      that.$message.error({
        content: "用户名格式不正确",
      });
      break;
    case 10004:
      that.$message.error({
        content: "密码格式不正确",
      });
      break;
    case 10005:
      that.$message.error({
        content: "邮箱格式不正确",
      });
      break;
    case 40003:
      that.$message.error({
        content: "没有权限",
      });
      break;
    case 40004:
      that.$message.error({
        content: "用户不存在",
      });
      break;
    case 50002:
      that.$message.warning({
        content: "登录失效",
        onClose: () => {
          that.$router.replace({name: "Login"})
        }
      });
      break;
    case -1:
      that.$message.error({
        content: "请求发生错误！"
      });
      break;
    default:
      that.$message.error({
        content: "操作失败！"
      })
  }
}
