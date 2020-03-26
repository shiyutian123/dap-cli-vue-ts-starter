<template>
  <div>
    <!-- 全屏布局路由,支持mutilTab  -->
    <router-view />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class FullScreenLayout extends Vue {
  name = 'FullScreenLayout';
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less"></style>
