<template>
  <a-modal
    :visible="visible"
    title="文章信息"
    okText="确认保存"
    @ok="publish"
    @cancel="cancel"
  >
    <a-form-model
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item
        label="文章描述"
        prop="description"
      >
        <a-input
          type="textarea"
          allowClear
          :auto-size="{ minRows: 2, maxRows: 6 }"
          :maxLength="descMaxLength"
          v-model="form.description"
        />
      </a-form-model-item>
      <a-form-model-item
        label="作者"
        prop="author"
      >
        <a-input
          :maxLength="12"
          v-model="form.author"
        />
      </a-form-model-item>
      <a-form-model-item
        label="封面大图"
        prop="region"
      >
        <a-upload
          v-if="cover===null"
          :before-upload="beforeUpload"
          list-type="picture-card"
          :show-upload-list="false"
          :disabled="cover!==null"
          @change="uploadChange"
        >
          <div style="width: 375px;height: 125px;line-height: 125px">点击选择封面图片</div>
        </a-upload>
        <div class="pre-box" v-else @mouseenter="()=>this.delCoverBtnVisible=true"
             @mouseleave="()=>this.delCoverBtnVisible =false">
          <img id="coverImg" class="img" :src="imageUrl"/>
          <a-icon v-show="delCoverBtnVisible" class="cover-delete" type="delete" theme="filled" title="删除"
                  @click="deleteCover"/>
        </div>
      </a-form-model-item>
      <a-form-model-item
        label="分类"
        prop="category"
      >
        <a-select v-model="form.category" default-value="请选择分类" style="width: 200px">
          <div slot="dropdownRender" slot-scope="menu">
            <v-nodes :vnodes="menu"/>
            <a-divider style="margin: 4px 0;"/>
            <div
              v-if="currentCategoryPage<=categoryTotalPage"
              style="padding: 4px 8px; cursor: pointer;text-align: center"
              @mousedown="e => e.preventDefault()"
              @click="loadMoreCategory"
            >
              点击加载更多分类
            </div>
            <div v-else style="padding: 4px 8px;text-align: center">没有更多了</div>
          </div>
          <a-select-option v-for="item in category" :key="item.id" :value="JSON.stringify(item)">
            {{ item.categoryName}}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item
        label="标签"
        prop="tag"
      >
        <a-select
          mode="multiple"
          placeholder="选择标签(选填)"
          :value="selectedTags"
          style="width: 100%"
          @change="tagSelectChange"
        >
          <div slot="dropdownRender" slot-scope="menu">
            <v-nodes :vnodes="menu"/>
            <a-divider style="margin: 4px 0;"/>
            <div
              v-if="currentTagPage<=tagTotalPage"
              style="padding: 4px 8px; cursor: pointer;text-align: center"
              @mousedown="e => e.preventDefault()"
              @click="loadMoreTag"
            >
              点击加载更多标签
            </div>
            <div v-else style="padding: 4px 8px;text-align: center">没有更多了</div>

          </div>
          <a-select-option v-for="item in tagOptions" :key="item.id" :value="item.tagName">
            {{ item.tagName }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item v-if="isSuperAdmin" label="状态" prop="status">
        <!--状态-->
        <a-radio-group
          :default-value="2"
          class="item"
          v-model="form.status"
          button-style="solid"
        >
          <a-radio-button :value="0">
            正常
          </a-radio-button>
          <a-radio-button :value="1">
            删除
          </a-radio-button>
          <a-radio-button :value="2">
            审核中
          </a-radio-button>
          <a-radio-button :value="3">
            审核失败
          </a-radio-button>
        </a-radio-group>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
  //获取图片的base64数据
  import {getCategoryPage, getTagPage} from "network/article";
  import responseCode from "network/responseCode";

  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  export default {
    name: "PublishModal",
    props: {
      //显示弹窗
      "visible": {
        type: Boolean,
        default: false
      },
      "isSuperAdmin":{
        type: Boolean,
        default: false
      }
    },
    components: {
      VNodes: {
        functional: true,
        render: (h, ctx) => ctx.props.vnodes,
      },
    },
    computed: {
      tagOptions() {
        return this.tags.filter(item =>!this.selectedTags.includes(item.tagName)
        );
      },
    },
    data() {
      return {
        delCoverBtnVisible: false,
        cover: null,
        imageUrl: "",//封面图的url
        descMaxLength: 200,//文章描述的最大长度
        labelCol: {span: 4},//标题的长度占比
        wrapperCol: {span: 20},//内容的长度占比
        form: {
          description: '',
          author:"",
          category: null,
          status:2
        },
        rules: {//输入信息的规则
          description: [
            {required: true, message: '请输入文章描述', trigger: 'blur'},
            {min: 10, max: this.descMaxLength, message: '描述文字长度应该在10~100之间', trigger: 'blur'},
          ],
          author: [
            {required: true, message: '请输入作者', trigger: 'blur'},
            {max: 12, message: '作者名字太长', trigger: 'blur'},
          ],
          category: [{required: true, message: '请选择分类', trigger: 'change'},],
          status: [{required: true, message: '请选择状态', trigger: 'change'},]
        },
        category: [],//分类信息
        currentCategoryPage: 1,//分类信息当前页码
        categoryPageSize: 10,//分类信息每页数据条数
        categoryTotalPage: 0,//分类信息总页数
        selectedTags: [],//已选中的标签
        tags: [],//所有标签
        currentTagPage: 1,//标签信息当前页码
        tagPageSize: 10,//标签信息每页数据条数
        tagTotalPage: 0,//标签信息总页数
      }
    },
    watch: {
      visible(value) {
        if (value) {
          this.getCategoryData();
          this.getTagData();
        } else {
          this.currentCategoryPage = 1;
          this.category = [];
          this.currentTagPage = 1;
          this.tags = [];
        }
      }
    },
    methods: {
      //标签选择变化
      tagSelectChange(value) {
        this.selectedTags = value;
      },
      loadMoreTag(){
        this.getTagData();
      },
      getTagData() {
        getTagPage(this.currentTagPage, this.tagPageSize).then(res => {
          if (res.code === 20000) {
            this.tags = [...this.tags, ...res.data.data];
            this.tagTotalPage = res.data.totalPage;
            this.currentTagPage++;
          } else {
            responseCode(res.code, this)
          }
        }).catch(err => {
          responseCode(-1, this);
        })
      },
      //分页获取分类数据
      getCategoryData() {
        getCategoryPage(this.currentCategoryPage, this.categoryPageSize).then(res => {
          if (res.code === 20000) {
            this.category = [...this.category, ...res.data.data];
            this.categoryTotalPage = res.data.categoryTotalPage;
            this.currentCategoryPage++;
          } else {
            responseCode(res.code, this)
          }
        }).catch(err => {
          responseCode(-1, this);
        })
      },
      //加载更多
      loadMoreCategory() {
        this.getCategoryData();
      },
      //删除封面图
      deleteCover() {
        this.cover = null;
        this.imageUrl = ""
        this.delCoverBtnVisible = false
      },
      //封面图发送变化
      uploadChange(info) {
        getBase64(info.fileList[0].originFileObj, imageUrl => {
          this.imageUrl = imageUrl;
        });
      },
      beforeUpload(file) {
        this.cover = file;
        return false;
      },
      //发布
      publish() {
        this.$refs.form.validate(valid => {
          if (valid) {

            const {selectedTags,tags} = this,tagList=[];
            for (let i in selectedTags){
              for (let j in tags){
                if (selectedTags[i]===tags[j].tagName){
                  tagList.push(tags[j])
                }
              }
            }
            this.$emit('publish',this.form.description,this.cover,this.form.category,tagList,this.form.author,this.form.status);
          } else {
            return false;
          }
        });
      },
      //取消
      cancel() {
        this.$emit("cancel")
      }
    }
  }
</script>

<style scoped>
  .pre-box {
    width: 100%;
    height: 150px;
    line-height: 100px;
    position: relative;
    display: flex;
    justify-content: center;
  }

  .pre-box .img {
    width: auto;
    height: 150px;
    margin: 0 auto;
  }

  .cover-delete {
    width: 100%;
    height: 150px;
    line-height: 150px;
    position: absolute;
    left: 0px;
    top: 0px;
    font-size: 30px;
    background: black;
    color: white;
    padding: 5px;
    opacity: 0.5;
    border-radius: 5px;
  }
</style>
