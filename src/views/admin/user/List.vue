<template>
  <div>
    <form action="http://47.103.62.145:8848/api/v3/admin/mail/send" method="post" enctype="multipart/form-data">
      <input type="email" name="to"/>
      <input type="text" name="subject"/>
      <input type="text" name="text"/>
      <input type="file" name="files[]" multiple/>
      <input type="submit" value="提交"/>
    </form>
  </div>
</template>
<script>

  export default {
    data() {
      return {};
    },
    methods: {},
  };
</script>
