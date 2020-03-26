<template>
  <div>
    <!-- 空白布局路由-->
    <router-view />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class BlankLayout extends Vue {
  name = 'BlankLayout';
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less"></style>
