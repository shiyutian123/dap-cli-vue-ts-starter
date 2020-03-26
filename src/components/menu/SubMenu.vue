<!--
 * @Author: DevinShi
 * @Date: 2020-02-05 09:03:40
 * @LastEditors: DevinShi
 * @LastEditTime: 2020-02-05 09:03:41
 * @Description: file content description
 -->
<template functional>
  <a-sub-menu :key="props.menuInfo.key">
    <span slot="title">
      <a-icon :type="props.menuInfo.icon" /><span>{{
        props.menuInfo.title
      }}</span>
    </span>
    <template v-for="item in props.menuInfo.children">
      <a-menu-item v-if="item.children.length === 0" :key="item.key">
        <a-icon :type="item.icon" />
        <span>{{ item.title }}</span>
      </a-menu-item>
      <sub-menu v-else :key="item.key" :menu-info="item" />
    </template>
  </a-sub-menu>
</template>
<script>
export default {
  props: ['menuInfo']
}
</script>
