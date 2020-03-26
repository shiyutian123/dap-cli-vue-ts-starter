<template>
  <div class="unauth-box">
    <div class="unauth-modal">
      <div class="unauth-icon">
        <a-icon type="exclamation-circle" />
      </div>
      <p class="unauth-text">
        本地开发暂时无法访问DAP开发的代码！
      </p>
      <p class="unauth-message">
        <span>如有需求，请联系DAP团队</span>
        <span style="display: block;margin-top: 16px;">
          <a @click="toLogin()">返回到登录页</a>
        </span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Watch } from "vue-property-decorator";
import Component from "vue-class-component";
import apis from "@/api";
import { Mutation, namespace, State } from "vuex-class";
import { RESET_APP_INFO } from "@/store/appInfo.store.ts";
import { RESET_AUTH_STORE } from "@/store/auth.store.ts";

const config = require(`../../../public/config/${process.env.VUE_APP_CONFIG_JSON}`);

const appInfoModule = namespace("appInfoModule");
const authModule = namespace("authModule");

export default class SystemFunTip extends Vue {
  @authModule.Mutation(RESET_AUTH_STORE) resetAuthStore: any;
  @appInfoModule.Mutation(RESET_APP_INFO) resetAppInfo: any;

  toLogin() {
    if (config.needSSO) {
      window.location.href = config.ssoConfig.logoutStandard;
    } else {
      (this as any).$router.push("/BlankLayout/login");
    }
  }
}
</script>

<style lang="less" scoped src="./index.less"></style>
