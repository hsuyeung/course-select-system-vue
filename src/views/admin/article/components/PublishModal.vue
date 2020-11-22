<template>
  <a-modal
    :visible="visible"
    title="完善信息"
    okText="确认发布"
    @ok="publish"
    :zIndex="1500"
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
          <div style="width: 300px;height: 100px;line-height: 100px">点击选择封面图片</div>
        </a-upload>
        <div  class="pre-box" v-else @mouseenter="()=>this.delCoverBtnVisible=true" @mouseleave="()=>this.delCoverBtnVisible =false" >
          <img id="coverImg" class="img" :src="imageUrl"/>
          <a-icon v-show="delCoverBtnVisible" class="cover-delete" type="delete" theme="filled" title="删除" @click="deleteCover"/>
        </div>
      </a-form-model-item>
      <a-form-model-item
        label="分类"
        prop="category"
      >



      </a-form-model-item>
    </a-form-model>


  </a-modal>
</template>

<script>
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

    data() {
      return {
        delCoverBtnVisible:false,
        cover: null,
        imageUrl: "",
        uploading: false,
        descMaxLength: 200,
        labelCol: {span: 4},
        wrapperCol: {span: 20},
        other: '',
        form: {
          description: '',
        },
        rules: {
          description: [
            {required: true, message: '请输入文章描述', trigger: 'blur'},
            {min: 10, max: this.descMaxLength, message: '描述文字长度应该在10~100之间', trigger: 'blur'},
          ],
          category: []
        },
      }
    },
    watch:{
      cover(){
        console.log(document.getElementById('coverImg').style.width)
      }
    },
    methods: {
      deleteCover() {
        this.cover = null;
        this.imageUrl = ""
        this.delCoverBtnVisible = false
      },
      uploadChange(info) {
        console.log(info);
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
