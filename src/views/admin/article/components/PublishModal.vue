<template>
  <a-modal
    :visible="visible"
    title="完善信息"
    okText="确认发布"
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
        <a-select v-model="form.category" default-value="请选择分类"  style="width: 200px" >
          <div slot="dropdownRender" slot-scope="menu">
            <v-nodes :vnodes="menu"/>
            <a-divider style="margin: 4px 0;"/>
            <div
              v-if="currentPage<=totalPage"
              style="padding: 4px 8px; cursor: pointer;text-align: center"
              @mousedown="e => e.preventDefault()"
              @click="loadMore"
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
    </a-form-model>
  </a-modal>
</template>

<script>
  //获取图片的base64数据
  import {getCategoryPage} from "network/article";
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
      }
    },
    components: {
      VNodes: {
        functional: true,
        render: (h, ctx) => ctx.props.vnodes,
      },
    },
    data() {
      return {
        items: ['jack', 'lucy'],
        delCoverBtnVisible: false,
        cover: null,
        imageUrl: "",//封面图的url
        uploading: false,
        descMaxLength: 200,//文章描述的最大长度
        labelCol: {span: 4},//标题的长度占比
        wrapperCol: {span: 20},//内容的长度占比
        form: {
          description: '',
          category:null,
        },
        rules: {//输入信息的规则
          description: [
            {required: true, message: '请输入文章描述', trigger: 'blur'},
            {min: 10, max: this.descMaxLength, message: '描述文字长度应该在10~100之间', trigger: 'blur'},
          ],
          category: [{required: true, message: '请选择分类', trigger: 'change'},]
        },
        category: [],//分类信息
        currentPage: 1,//分类信息当前页码
        pageSize: 10,//分类信息每页数据条数
        totalPage: 0,//分类信息总页数
      }
    },
    watch: {
      visible(value) {
        if (value) {
          this.getCategoryData()
        }else {
          this.currentPage = 1;
          this.category = [];
        }
      }
    },
    methods: {
      getCategoryData() {
        getCategoryPage(this.currentPage, this.pageSize).then(res => {
          if (res.code === 20000) {
            this.category = [...this.category, ...res.data.data];
            this.totalPage = res.data.totalPage;
            this.currentPage++;
          } else {
            responseCode(res.code, this)
          }
        }).catch(err => {
          responseCode(-1, this);
        })
      },
      loadMore() {
        this.getCategoryData();
      },
      deleteCover() {
        this.cover = null;
        this.imageUrl = ""
        this.delCoverBtnVisible = false
      },
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
            alert('submit!');
          } else {
            console.log('error submit!!');
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
