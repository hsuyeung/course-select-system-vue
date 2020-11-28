<template>
  <div class="name">
    <div style="height: 50px;width: 100%">
      <a-input
        v-model="title"
        style="width: 800px;"
        placeholder="请输入标题"
        size="large"
      />
      <a-button
        size="large"
        style="margin-left: 10px"
        type="primary"
        @click="()=>this.publishPanelVisible=true"
      >
        保存
      </a-button>
    </div>

    <editor-md
      ref="editor"
      class="editor"
      @change="contentChange"
    />
    <publish-modal
      ref="publish"
      :visible="publishPanelVisible"
      :is-super-admin="isSuperAdmin"
      @cancel="cancelPublish"
      @publish="articlePublish"
    />
  </div>
</template>

<script>
  import EditorMd from "./components/EditorMd";
  import PublishModal from "./components/PublishModal";
  import {publishArticle, uploadImg} from "network/article";
  import {getCookie} from "common/cookie";

  export default {
    name: "Edit",
    components: {
      EditorMd,
      PublishModal
    },
    data() {
      return {
        title: "",//标题
        md: "",//md内容
        html: "",//html内容
        imgFile: {},//图片文件
        publishPanelVisible: false,//发布面板是否显示
        isSuperAdmin: false,//是否是超级管理员
        oldImgFile: [],//旧的文章图片
        newImgFile: [],//新的文章图片
      }
    },
    created() {
      //获取当前用户的角色
      let roles = getCookie('role');
      this.isSuperAdmin = roles.includes('SUPER_ADMIN')

    },
    activated() {
      if (Object.getOwnPropertyNames(this.$route.params).length !== 0) {
        const {title, description, author, category, status, mdContent, cover, tags, htmlContent} = this.$route.params;
        this.setArticleData(title, description, author, category, status, mdContent, cover, tags);
        this.$refs.publish._data.imageUrl = cover;
        //匹配img标签
        let imgReg = /<img.*?(?:>|\/>)/gi;
        //匹配src属性
        let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;

        let imgArr = htmlContent.match(imgReg);

        //循环匹配src值，并存起来
        this.oldImgFile = imgArr.map(item => {
          return item.match(srcReg)[1];
        })
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
      articlePublish(description, cover, category, tagList, author, status) {
        return;
        if (this.title === "") {
          this.$message.warning({
            content: "请输入标题"
          });
          return;
        }
        let article = {};

        this.$message.loading({
          content: "正在发布文章",
          duration: 0
        });

        new Promise((resolve, reject) => {
          if (cover != null) {
            // 1、上传封面图获取图片链接
            let coverFormData = new FormData();
            coverFormData.append('file', cover);
            uploadImg(coverFormData).then(res => {
              if (res.code && res.code === 20003) {
                article["cover"] = res.data;
                resolve();
              } else {
                reject(res.msg);
              }
            }).catch(err => {
              reject(err);
            })
          } else {
            resolve();
          }
        }).then(res => {
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
            } else {
              delete this.imgFile[key]
            }
          });

          //将Promise上传全部完成之后的结果返回给下一级
          return Promise.all(PromiseArr)

        }).then(res => {

          // 3、获取到链接之后，循环替换文章里面的对应标记为图片链接
          Object.keys(this.imgFile).map((key, index) => {
            this.$refs.editor.$refs.md.$img2Url(key, res[index].data)
          });

          // 4、组装文章对象，将标题、描述、封面图、分类、标签、内容组装为一个对象
          const {title, md, html} = this;
          article["title"] = title;
          article["author"] = author;
          article["mdContent"] = md;
          article["htmlContent"] = html;
          article["description"] = description;
          article["category"] = JSON.parse(category);
          article["tags"] = tagList;
          article["status"] = status;
          // 5、发布文章
          return publishArticle(article)
        }).then(res => {
          this.$message.destroy();
          if (res.code && res.code === 20000) {
            this.publishPanelVisible = false;

            this.$message.success({
              content: "发布成功"
            });

            this.$refs.editor._data.content = "";//清空内容
            this.title = "";//清空标题
            this.$refs.publish._data.form = {//清空发布弹窗组件中的描述、作者、分类等信息
              description: '',
              author: "",
              category: null,
              status: 2
            }
            this.$refs.publish._data.cover = null;//清空标题图
            this.$refs.publish._data.selectedTags = [];//清空已选标签
          } else {
            return Promise.reject("文章发布失败");
          }
        }).catch(err => {
          this.$message.error({
            content: err
          })
        })
      },
      setArticleData(title, description, author, category = null, status = 2, content, cover = null, tags = []) {
        this.$refs.editor._data.content = content;//内容
        this.title = title;//标题
        this.$refs.publish._data.form = {//发布弹窗组件中的描述、作者、分类等信息
          description,
          author,
          category: category ? JSON.stringify(category) : category,
          status
        };
        this.$refs.publish._data.cover = cover;//标题图
        this.$refs.publish._data.selectedTags = tags.map(tag => tag.tagName);//已选标签
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
