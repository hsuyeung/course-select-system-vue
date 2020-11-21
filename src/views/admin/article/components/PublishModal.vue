<template>
  <a-modal :visible="visible" title="发布" @ok="publish" :zIndex="1500" @cancel="cancel">

  </a-modal>
</template>

<script>
  export default {
    name: "PublishModal",
    props:{
      //显示弹窗
      "visible":{
        type:Boolean,
        default:false
      }
    },
    data(){
      return{

      }
    },
    methods:{
      //发布
      publish(){

      },
      //取消
      cancel(){
        this.$emit("cancel")
      }
    }
  }
</script>

<style scoped>

</style>
