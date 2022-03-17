<template>
  <div class="sidebar">
    <div class="sidebar__logo">
      <img width="133" height="25" src="~/assets/logo/logo-dedi-typo-small.svg" alt="Logo Desa Digital">
      <img width="211" height="40" src="~/assets/logo/logo-text-cms.svg" alt="Logo text Content Management System">
    </div>
    <div class="sidebar__container-menu">
      <div class="sidebar__menu">
        <nuxt-link v-for="menu in mainMenu" :key="menu.path" :to="{name: menu.path}" class="sidebar__menu-item">
          <div class="sidebar__menu-item-box">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="sidebar__menu-item-icon" v-html="svg(menu.icon)" />
            <span class="sidebar__menu-item-title">{{ menu.name }}</span>
          </div>
          <jds-icon
            v-if="menu.arrow"
            name="chevron-right"
            size="16px"
            class="sidebar__menu-item-arrow"
          />
        </nuxt-link>
        <div class="sidebar__menu-title">
          Master Data
        </div>
        <nuxt-link v-for="menu in masterDataMenu" :key="menu.path" :to="{name: menu.path}" class="sidebar__menu-item">
          <div class="sidebar__menu-item-box">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="sidebar__menu-item-icon" v-html="svg(menu.icon)" />
            <span class="sidebar__menu-item-title">{{ menu.name }}</span>
          </div>
          <jds-icon
            v-if="menu.arrow"
            name="chevron-right"
            size="16px"
            class="sidebar__menu-item-arrow"
          />
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mainMenu, masterDataMenu } from '@/constants/menu'
export default {
  name: 'ComponentSidebar',
  data () {
    return {
      activeMenu: 'Dashboard',
      mainMenu,
      masterDataMenu
    }
  },
  methods: {
    svg (name) {
      return require(`~/assets/icons/${name}.svg?raw`)
    }
  }
}
</script>

<style lang="postcss">
@import './Sidebar.pcss';
</style>
