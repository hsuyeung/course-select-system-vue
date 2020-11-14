export default function responseCode(code, that) {

  switch (code) {
    case 10000:
      that.$message.error({
        content: "信息格式错误",
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
        content: "获取数据失败！"
      })
  }
}
