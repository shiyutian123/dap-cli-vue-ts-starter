<template>
  <div class="unauth-box">
    <div class="unauth-modal">
      <div class="unauth-icon">
        <a-icon type="exclamation-circle" />
      </div>
      <p class="unauth-text">
        首页，查看自开发文档，请参考AAAA<a></a>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Watch } from "vue-property-decorator";

export default class Guide extends Vue {
}
</script>
