<template>
  <div class="name">
    <div style="height: 50px;width: 100%">
      <a-input style="width: 800px;" placeholder="请输入标题" size="large"/>
      <a-button size="large" style="margin-left: 10px" type="primary" @click="()=>this.publishPanelVisible=true">发布
      </a-button>
    </div>

    <editor-md class="editor" @change="contentChange"/>
    <publish-modal :visible="publishPanelVisible" @cancel="cancelPublish"/>
  </div>
</template>

<script>
  import EditorMd from "./components/EditorMd";
  import PublishModal from "./components/PublishModal";
  export default {
    name: "Add",
    components: {
      EditorMd,
      PublishModal
    },
    data() {
      return {
        md: "",//md内容
        html: "",//html内容
        publishPanelVisible: false,//发布面板是否显示
      }
    },
    methods: {
      //编辑器内容发生变化
      contentChange(content, html) {
        this.md = content;
        this.html = html
      },
      //发布文章的弹窗取消事件
      cancelPublish(){
        this.publishPanelVisible = false;
      }

    }
  }
</script>

<style scoped>
  .name {
    height: 100%;
  }

  .editor {
    height: calc(100% - 50px);
  }
</style>
