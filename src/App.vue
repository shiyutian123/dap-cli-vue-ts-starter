<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { State, Mutation, namespace } from 'vuex-class'
const authModule = namespace('authModule')

@Component
export default class BasicLayout extends Vue {
  @authModule.Getter('tokenValue') tokenValue: any;

  created() {
    if (this.tokenValue) {
      (Vue as any).addHeaders({
        AuthorizationToken: this.tokenValue
      });
    }
  }
}
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
