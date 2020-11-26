<template>
  <div>
    <mavon-editor
      :value="value"
      v-model="content"
      ref="md"
      @change="change"
      :placeholder="placeholder"
      :style="{height:height,zIndex:500}"
      :navigation="navigation"
      @imgAdd="imgAdd"
      @imgDel="deleteImg"
    />
  </div>
</template>

<script>
  import {mavonEditor} from 'mavon-editor';
  import "mavon-editor/dist/css/index.css";
  export default {
    name: "EditorMd",
    props:{
      "placeholder":{
        type:String,
        default:"开始创作吧..."
      },
      "navigation":{
        type:Boolean,
        default: true
      },
      "height":{
        type:String,
        default:"100%"
      },
      "value":{
        type:String,
        default:""
      }
    },
    components: {
      mavonEditor
    },
    data() {
      return {
        content: '', // 输入的markdown
        html: '',    // 及时转的html
        img_file: {},//图片文件
      }
    },
    watch:{
      value(value){
        if (value===""){
          this.content = "";
          this.html = ""
        }
      }
    },
    methods: {
      // 所有操作都会被解析重新渲染
      change(value, render) {
        // render 为 markdown 解析后的结果[html]
        this.html = render;
        //发出change事件，参数为markdown和html
        this.$emit('change', value, this.html);
      },
      //添加图片
      imgAdd(position,file){
        this.img_file[position] = file;
      },
      //删除图片
      deleteImg(file){
        delete this.img_file[file[0]];
      }
    }
  }
</script>

<style scoped>

</style>
