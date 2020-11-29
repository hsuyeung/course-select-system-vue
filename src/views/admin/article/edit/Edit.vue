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
  import {updateArticle, uploadImg, deleteFile} from "network/article";
  import {getCookie} from "common/cookie";

  export default {
    name: "Edit",
    components: {
      EditorMd,
      PublishModal
    },
    data() {
      return {
        data: {},
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
        const {id, title, description, author, category, status, mdContent, cover, tags, htmlContent} = this.$route.params;
        this.setArticleData(title, description, author, category, status, mdContent, cover, tags);
        this.$refs.publish._data.imageUrl = cover;
        this.data = this.$route.params;
        //匹配img标签
        let imgReg = /<img.*?(?:>|\/>)/gi;
        //匹配src属性
        let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;

        let imgArr = htmlContent.match(imgReg);

        //循环匹配src值，并存起来
        if (imgArr != null) {
          this.oldImgFile = imgArr.map(item => {
            return item.match(srcReg)[1];
          })
        }

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

        if (this.title === "") {
          this.$message.warning({
            content: "请输入标题"
          });
          return;
        }
        let article = JSON.parse(JSON.stringify(this.data));

        this.$message.loading({
          content: "正在保存文章",
          duration: 0
        });

        new Promise((resolve, reject) => {
          if (cover!=null){
            // 现在cover有值
            if (typeof cover==='string'){
              //是string，说明以前肯定有值
              article["cover"] = cover;
              resolve();
            }else {
              //是文件对象
              let coverFormData = new FormData();
              coverFormData.append('file', cover);
              uploadImg(coverFormData).then(res => {
                if (res.code && res.code === 20003) {
                  article["cover"] = res.data;
                  if (this.data.cover && this.data.cover != null){
                    //以前有值
                    let delCover = this.data.cover.split('/');
                    delCover = delCover[delCover.length - 1].split(':')[0];
                    deleteFile(delCover)
                  }
                  resolve();
                } else {
                  reject(res.msg);
                }
              }).catch(err => {
                reject(err);
              })
            }
          }else {
            // cover没有值
            if (this.data.cover && this.data.cover != null){
              //以前有值
              let delCover = this.data.cover.split('/');
              delCover = delCover[delCover.length - 1].split(':')[0];
              deleteFile(delCover)
            }
            article["cover"] = null;
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

          // 1、获取新的图片列表
          //匹配img标签
          let imgReg = /<img.*?(?:>|\/>)/gi;
          //匹配src属性
          let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;


          let imgArr = [];
          imgArr = this.html.match(imgReg);

          if (imgArr != null) {
            imgArr.map(item => {
              this.newImgFile.push(item.match(srcReg)[1]);
            })
          }


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
          return updateArticle(article)
        }).then(res => {
          this.$message.destroy();
          if (res.code && res.code === 20000) {
            this.publishPanelVisible = false;

            this.$message.success({
              content: "保存成功"
            });
            this.setArticleData();
            this.$EventBus.$emit("editArticleSuccess");
            return Promise.resolve();
          } else {
            return Promise.reject("文章发布失败");
          }
        }).then(res => {

          // 2、循环遍历旧的图片列表，判断是否在新的列表中
          let delImgArr = [];
          this.oldImgFile.map(imgUrl => {
            if (this.newImgFile.indexOf(imgUrl) < 0) {
              // 3、不存在的就包装成Promise数组删除
              imgUrl = imgUrl.split('/');
              imgUrl = imgUrl[imgUrl.length - 1].split(':')[0];
              delImgArr.push(imgUrl);
            }
          });

          delImgArr = delImgArr.join(',')

          if (delImgArr.length !== 0) {
            deleteFile(delImgArr).then(res => {
              return Promise.resolve();
            }).catch(err => {
              return Promise.reject(err)
            })
          }
        }).catch(err => {
          this.$message.destroy();
          this.$message.error({
            content: "保存失败"
          })
        })
      },
      // 设置文章数据
      setArticleData(title = "", description = "", author = "", category = null, status = 2, content = "", cover = null, tags = []) {
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
