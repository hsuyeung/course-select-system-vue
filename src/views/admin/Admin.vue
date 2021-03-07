<template>
  <a-layout style="height: 100vh;width: 100vw;display: flex">
    <!--    侧边导航开始-->
    <a-layout-sider v-model="collapsed" collapsible
                    :style="{ overflow: 'auto', height: '100vh' }">
      <!--      logo-->
      <div class="logo"/>
      <!--      菜单-->
      <a-menu theme="dark" :default-selected-keys="['1']" :selectedKeys="[panes[activeKey].pathName]" mode="inline"
              @select="handleMenuItemClick">
        <!--        子菜单-->
        <a-sub-menu :key="sub.key" v-for="sub in menu">
          <!--          子菜单标题-->
          <span slot="title"><a-icon :type="sub.icon"/><span>{{sub.title}}</span></span>
          <!--          菜单项-->
          <a-menu-item :key="item.key" v-for="item in sub.childrenMenu">
            {{item.title}}
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <!--    侧边导航结束-->
    <a-layout style="height:100vh;flex:1">

      <!--      顶部开始-->
      <a-layout-header style="">
        <a-menu
          theme="dark"
          mode="horizontal"
          :default-selected-keys="['2']"
          style="line-height: 64px;float: left"
        >
          <a-menu-item key="1">
            nav 1
          </a-menu-item>
          <a-menu-item key="2">
            nav 2
          </a-menu-item>
          <a-menu-item key="3">
            nav 3
          </a-menu-item>
        </a-menu>

        <!--        顶部右侧的用户名及菜单-->
        <a-dropdown style="float: right">
          <a class="ant-dropdown-link" style="font-size: 20px;color:#025BF2;">
            {{username}}
            <a-icon type="down"/>
          </a>
          <a-menu slot="overlay">
            <a-menu-item key="">
              修改密码
            </a-menu-item>
            <a-menu-item @click="logOut">
              退出登录
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </a-layout-header>
      <!--      顶部结束-->

      <!--      主要内容区域-->
      <a-layout-content class="content" style="background: white;padding: 5px">

        <!--        tab切换-->
        <a-tabs v-model="activeKey" hide-add type="editable-card" @edit="onEdit" style="width: 100%;height: 50px"
                @change="tabChange">
          <a-tab-pane v-for="(item,index) in panes" :key="index" :tab="item.title" :closable="item.closable"
                      forceRender>

          </a-tab-pane>
        </a-tabs>

        <!--        内容展示-->
        <div class="content-box">
          <keep-alive>
            <router-view/>
          </keep-alive>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
  import {getMenu} from "common/utils";//引入获取菜单数据的方法
  import {checkCookie, getCookie, setCookie} from "common/cookie";
  import {logout} from "network/login";
  //cookie相关方法

  export default {
    name: "Admin",
    data() {
      return {
        collapsed: false,//侧边导航是否展开
        panes: [
          {title: "控制台", pathName: "Home", closable: false},
        ],//tab数据
        activeKey: 0,//当前选中的tab
        menu: [],//菜单数据
        username: "",//管理员用户名
      };
    },
    methods: {
      // 退出登录
      logOut() {
        // 弹出提示框
        this.$confirm({
          title: '确认退出登录？',
          okText: '退出',
          okType: 'danger',
          centered: true,
          cancelText: '取消',
          onOk: () => {
            // 调用退出登录的api
            logout().then(res => {
              const {code, msg} = res;
              if (code === 20002) {//判断code
                // 清除本地信息
                setCookie("token", "", 0);
                setCookie("username", "", 0);
                setCookie("role", '', 0);
                //提示信息
                this.$message.success({
                  content: msg,
                  onClose: () => {
                    //跳转到登录界面
                    this.$router.replace({name: 'Login'})
                  }
                })
              } else {
                //错误信息提示
                this.$message.error({
                  content: msg
                })
              }
            }).catch(err => {
              //错误信息提示
              this.$message.error({
                content: "请求发送错误"
              })
            })
          }
        })

      },
      //tabs新增或者删除的方法
      onEdit(targetKey, action) {
        this[action](targetKey);
      },
      //tab切换的方法
      tabChange(key) {
        this.$router.replace({name: this.panes[key].pathName});
      },
      //tabs删除tab的方法
      remove(targetKey) {
        let activeKey = this.activeKey;
        //从数据中删除要关闭的tab
        this.panes.splice(targetKey, 1);
        if (activeKey == targetKey) {//判断要关闭的tab是否处于打开状态,设置最后一个为打开状态
          this.activeKey = this.panes.length - 1;
          this.$router.replace({name: this.panes[this.activeKey].pathName});
        } else if (activeKey > targetKey) {//判断要关闭的tab是否在打开tab的左侧
          this.activeKey = this.activeKey - 1;
        }
      },
      //左侧菜单点击事件
      handleMenuItemClick(item, key, keyPath) {
        // 要插入的tab数据
        let pane = {title: item.domEvent.target.innerText, pathName: item.key};
        //判断当前点击的菜单是否有打开的窗口
        if (!JSON.stringify(this.panes).includes(JSON.stringify(pane))) {
          //如果没有打开的窗口，就插入到最后，并切换为打开状态
          this.panes.push(pane);
          this.activeKey = this.panes.length - 1;
        } else {
          //如果有打开的窗口则切换为打开状态
          this.activeKey = this.panes.findIndex((pane) => {
            return pane.pathName == item.key;
          });
        }
        //打开路由
        this.$router.replace({name: item.key});
      },
    },
    /**
     * 生命周期函数
     */
    created() {
      //判断token是否存在
      if (!checkCookie('token')) {
        this.$router.replace({name: "Login"})
      } else {
        this.menu.push(...getMenu()); // 获取菜单
        this.$router.replace({name: "Home"});
        this.username = getCookie('username');
      }
      this.$EventBus.$on("editArticle", (data) => {
        let pane = {
          title: "编辑文章",
          pathName: "EditArticle"
        }
        if (!JSON.stringify(this.panes).includes(JSON.stringify(pane))) {
          this.panes.push(pane);
          this.activeKey = this.panes.length - 1;
        } else {
          this.activeKey = this.panes.findIndex((pane1) => {
            return pane1.pathName == pane.pathName;
          });
        }
        this.$router.replace({name: pane.pathName, params: data});
      })
      this.$EventBus.$on("editArticleSuccess",()=>{
        this.remove(this.activeKey);
      })
    }
  };
</script>

<style scoped>
  .content-box {
    width: 100%;
    height: calc(100% - 50px);
    overflow: auto;
  }


  .content >>> .ant-tabs-tabpane {
    display: block;
    overflow: auto;
  }

  .content >>> .ant-tabs-content {
    height: 100%;
    display: none;
  }

  .content-box::-webkit-scrollbar { /*滚动条整体样式*/
    width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 2px;
  }

  .content-box::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #001529;
  }

  .content-box::-webkit-scrollbar-track { /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #FFFFFF;
  }

  .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
  }
</style>
