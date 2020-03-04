<template>
  <div class="commont-footer">
    <p class="ali-ba">
      <a href="http://beian.miit.gov.cn" class="a-ba">京ICP备19055467号-1</a>
    </p>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  data () {
    return {

    }
  }
}
</script>

<style>
.commont-footer{
  width: 100%;
  position: fixed;
  background: rgba(0,0,0,0.2);
  color:#fff;
  bottom: 0;
}
.ali-ba{
  margin: 20px auto;
  text-align: center;
}
.a-ba{
  font-size: 12px;
  color: #fff;
  text-decoration: none;
}
</style>
