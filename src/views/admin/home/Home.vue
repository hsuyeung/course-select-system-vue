<template>
  <div>
    <Comp1 />
    <Comp2/>
  </div>
</template>

<script>
  import Comp1 from "./childComps/Comp1";
  import Comp2 from "./childComps/Comp2";
  export default {
    components:{
      Comp1,
      Comp2
    }
  }
</script>

<style scoped>

</style>
