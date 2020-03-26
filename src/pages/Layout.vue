<!--
 * @Author: Devin Shi
 * @Email: yutian.shi@definesys.com
 * @Date: 2019-09-11 18:13:53
 * @LastEditTime: 2020-02-25 17:53:33
 * @LastEditors: DevinShi
 * @Description:
 -->
<template>
  <div>
    <component v-if="layout && layout.length > 0" :is="layout"></component>
  </div>
</template>
<script lang="ts">
import Component from 'vue-class-component'
import store from '../store'
import * as layoutComponents from '../layouts'
import { Vue, Watch } from 'vue-property-decorator'

@Component({
  components: {
    ...layoutComponents
  }
})
export default class Layout extends Vue {
  layout = '';

  created () {}

  mounted () {
    this.layoutChanged((this as any).$route.params.layout)
  }

  @Watch('$route.params.layout')
  onLayoutChanged (val: string, oldVal: string) {
    this.layoutChanged(val)
  }

  /**
   * 布局改变信息
   */
  layoutChanged (val: string) {
    if (val === 'default') {
      this.layout = 'BasicLayout'
    } else if (this.validLayoutExist(val)) {
      this.layout = val
    } else {
      this.layout = 'BasicLayout'
    }
  }

  /**
   * 验证布局是否存在
   */
  validLayoutExist (layoutName: string) {
    let exist = false
    console.log({ ...layoutComponents })
    for (const layoutComponentName in { ...layoutComponents }) {
      if (layoutComponentName === layoutName) {
        exist = true
        break
      }
    }
    return exist
  }
}
</script>
