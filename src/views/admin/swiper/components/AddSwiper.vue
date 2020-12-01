<template>
  <a-modal
    title="添加轮播"
    :visible="visible"
    okText="添加"
    cancelText="取消"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @ok="saveAdd"
    @cancel="addCancel"
  >
    <a-form-model
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item
        label="文章"
        prop="articleId"
      >
        <a-select v-model="form.articleId" default-value="请选择分类" style="width:100%">
          <div slot="dropdownRender" slot-scope="menu">
            <v-nodes :vnodes="menu"/>
            <a-divider style="margin: 4px 0;"/>
            <div
              v-if="currentArticlePage<=articleTotalPage"
              style="padding: 4px 8px; cursor: pointer;text-align: center"
              @mousedown="e => e.preventDefault()"
              @click="loadMoreArticle"
            >
              点击加载更多分类
            </div>
            <div v-else style="padding: 4px 8px;text-align: center">没有更多了</div>
          </div>
          <a-select-option v-for="item in article" :key="item.id" :value="item.id">
            {{ item.title}}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="权重" prop="sequence">
        <a-input-number v-model="form.sequence" :step="1"/>
      </a-form-model-item>
      <a-form-model-item label="开始时间" required prop="startTime">
        <a-date-picker
          v-model="form.startTime"
          show-time
          type="date"
          placeholder="选择开始时间"
          style="width: 100%;"
        />
      </a-form-model-item>
      <a-form-model-item label="结束时间" required prop="endTime">
        <a-date-picker
          v-model="form.endTime"
          show-time
          type="date"
          placeholder="选择结束时间"
          style="width: 100%;"
        />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
  import responseCode from "network/responseCode";
  import {getArticlePage,addSwiper} from "network/swiper";
  import moment from "moment"

  export default {
    name: "AddSwiper",
    props: {
      "visible": {//编辑弹窗是否可见
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
        confirmLoading: false,//确认按钮loading
        labelCol: {span: 4},
        wrapperCol: {span: 20},
        article: [],
        currentArticlePage: 1,//文章信息当前页码
        articlePageSize: 10,//文章信息每页数据条数
        articleTotalPage: 0,//文章信息总页数
        form: {
          articleId: '',
          sequence: 0,
          startTime:undefined,
          endTime:undefined
        },
        rules: {
          articleId: [{required: true, message: '请选择文章', trigger: 'blur'}],
          sequence: [{required: true, message: '请输入权重', trigger: 'blur'}],
          startTime: [{required: true, message: '请选择开始时间', trigger: 'blur'}],
          endTime: [{required: true, message: '请选择结束时间', trigger: 'blur'}],
        },
      }
    },
    watch: {
      visible(value) {
        if (value) {
          this.getArticleData();
        } else {
          this.article = [];
          this.currentArticlePage = 1;
        }
      },
    },

    methods: {
      getArticleData() {
        getArticlePage(this.currentArticlePage, this.articlePageSize).then(res => {
          if (res.code === 20000) {
            this.article.push(...res.data.data);
            this.articleTotalPage = res.data.totalPage;
            this.currentArticlePage++;
          } else {
            responseCode(res.code, this)
          }
        }).catch(err => {
          responseCode(-1, this);
        })
      },
      //加载更多
      loadMoreArticle() {
        this.getArticleData();
      },
      saveAdd() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.confirmLoading = true;
            this.form.sequence = parseInt(this.form.sequence);
            this.form.startTime = moment(this.form.startTime).format("YYYY-MM-DD HH:mm:ss");
            this.form.endTime = moment(this.form.endTime).format("YYYY-MM-DD HH:mm:ss");
            addSwiper(this.form).then(res => {
              if (res.code === 20000) {
                this.$message.success({
                  content: "添加成功"
                });
                this.$emit("success")
              } else {
                responseCode(res.code, this)
              }
              this.confirmLoading = false;
            }).catch(err => {
              responseCode(-1, this)
              this.confirmLoading = false;
            });

          } else {
            return false;
          }
        });
      },
      //取消添加
      addCancel() {
        this.confirmLoading = false;
        this.$emit('cancel');
      },
    }
  }
</script>

<style scoped>
  .item {
    margin-bottom: 15px;
  }
</style>
