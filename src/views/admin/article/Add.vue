<template>
  <div class="name">
    <div style="height: 50px;width: 100%">
      <a-input style="width: 800px;" placeholder="请输入标题" size="large"/>
      <a-button size="large" style="margin-left: 10px" type="primary" @click="()=>this.publishPanelVisible=true">发布
      </a-button>
    </div>

    <editor-md class="editor" @change="contentChange"/>
    <publish-modal :visible="publishPanelVisible" @cancel="cancelPublish" @publish="articlePublish"/>
  </div>
</template>

<script>
  import EditorMd from "./components/EditorMd";
  import PublishModal from "./components/PublishModal";
  import {uploadImg} from "../../../network/article";

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
        imgFile: {},//图片文件
        publishPanelVisible: false,//发布面板是否显示
      }
    },
    methods: {
      //编辑器内容发生变化
      contentChange(content, html, imgFile) {
        this.md = content;
        this.html = html;
        this.imgFile = imgFile;
      },
      //发布文章的弹窗取消事件
      cancelPublish() {
        this.publishPanelVisible = false;
      },
      articlePublish(description, cover, category, tagList) {
        // 1、上传封面图获取图片链接
        let coverFormData = new FormData();
        coverFormData.append('file', cover);
        uploadImg(coverFormData).then(res=>{
          // TODO 替换封面图链接
          console.log(1,res)


          // 2、循环上传文章的图片文件，判断文章中是否存在这个标记，存在的才上传
          //2.1定义图片上传的Promise的数组
          let PromiseArr = [];
          //循环上传将Promise对象存到数组中
          Object.keys(this.imgFile).filter(key => {
            let reg_str = "/(!\\[\[^\\[\]*?\\]\(?=\\(\)\)\\(\\s*\(" + key + "\)\\s*\\)/g";
            let reg = eval(reg_str);
            if (reg.test(this.md)) {
              let imgFormData = new FormData();
              imgFormData.append('file', this.imgFile[key]);
              PromiseArr.push(uploadImg(imgFormData));
            }
          });

          //将Promise上传全部完成之后的结果返回给下一级
          return Promise.all(PromiseArr)
        }).then(res=>{
          console.log(3,res);
        }).catch(err=>{
          console.log(err);
        })




        // Promise.all(
        //
        // ).then(res=>{
        //   console.log(res)
        // }).catch(err=>{
        //   console.log(err)
        // });


        // 3、获取到链接之后，循环替换文章里面的对应标记为图片链接
        // 4、组装文章对象，将标题、描述、封面图、分类、标签、内容组装为一个对象
        // 5、发布文章

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
