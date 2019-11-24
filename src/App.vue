<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
body,html {
  color: #fff;
  height: 100%;
}
#app {
  height: 100%;
}
.clearfix::after{
  content: '';
  display: block;
  clear: both;
}
</style>
