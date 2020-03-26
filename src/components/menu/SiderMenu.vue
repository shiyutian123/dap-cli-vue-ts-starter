<!--
 * @Author: DevinShi
 * @Date: 2020-02-05 05:08:43
 * @LastEditors: DevinShi
 * @LastEditTime: 2020-02-05 08:50:31
 * @Description: file content description
 -->
<template>
  <div class="slide">
    <div class="slide-switch"></div>
    <div class="slide-menu">
      <a-menu
        :defaultSelectedKeys="defaultSelectedKeys"
        :defaultOpenKeys="defaultOpenKeys"
        :mode="mode"
        :theme="theme"
        :inlineCollapsed="collapsed"
        @click="clickHandler"
      >
        <template v-for="item in menuList">
          <a-menu-item v-if="item.children.length === 0" :key="item.key">
            <a-icon :type="item.icon" />
            <span>{{ item.title }}</span>
          </a-menu-item>
          <sub-menu v-else :menu-info="item" :key="item.key" />
        </template>
      </a-menu>
    </div>
  </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Component, Prop, Vue } from 'vue-property-decorator'
import SubMenu from './SubMenu.vue'
import { IMenu } from '../../clazz/IMenu'

@Component({
  components: {
    'sub-menu': SubMenu
  }
})
export default class SiderMenu extends Vue {
  @Prop({ default: '200' }) private width!: number;
  @Prop({ default: false }) private collapsed!: boolean;
  @Prop({ default: [] }) private menuList!: Array<IMenu>;
  @Prop({ default: 'light' }) private theme!: string;
  @Prop({ default: 'inline' }) private mode!: string;
  @Prop() private defaultSelectedKeys: Array<any>;
  @Prop() private defaultOpenKeys: Array<any>;

  toggleCollapsed () {
    this.collapsed = !this.collapsed
  }

  findMenuByKey (key: string, tree: Array<IMenu>) {
    for (let i = 0, len = tree.length; i < len; i++) {
      if (tree[i].key === key) {
        return tree[i]
      } else if (tree[i].children.length > 0) {
        return this.findMenuByKey(key, tree[i].children)
      }
    }
  }

  clickHandler (event) {
    if (event && event.key) {
      const menu = this.findMenuByKey(event.key, this.menuList)
      this.$emit('menu-click', menu)
    }
  }
}
</script>
<style lang="less" scoped>
.slide-switch {
  width: 15px;
  height: 80px;
  line-height: 80px;
  padding-right: 2px;
  border-top-right-radius: 17px;
  border-bottom-right-radius: 17px;
  border: 1px solid #e8e8e8;
  border-left: 0;
  background: #fff;
  font-size: 0.7rem;
  color: rgba(0, 0, 0, 0.4);
  text-align: right;
  position: absolute;
  top: calc(50% - 45px);
  right: 3px;
  -webkit-transform: translateX(120%);
  transform: translateX(120%);
  cursor: pointer;
  z-index: -1;
  opacity: 0.4;
}
</style>
