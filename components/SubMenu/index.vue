<template>
  <div class="sticky-submenu">
    <div class="submenu">
      <div class="submenu__wrapper">
        <span
          v-for="(menu, index) in menus"
          :key="index"
          :class="{
            'submenu__menu': true,
            'submenu__menu--active': activeMenu === menu.value
          }"
          @click="activeMenu = menu.value"
        >
          {{ menu.label }}
          <div
            v-if="activeMenu === menu.value"
            class="submenu__menu-indicator-active"
          />
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComponentSubMenu',
  props: {
    menus: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      activeMenu: null
    }
  },
  watch: {
    activeMenu (value) {
      this.$store.commit('setSubMenu', value)
      this.$emit('change', value)
    }
  },
  mounted () {
    if (this.$store.state.isSameRoutePage) {
      this.activeMenu = this.$store.state.subMenu
    } else {
      this.activeMenu = this.menus[0].value
    }
  }
}
</script>

<style lang="postcss">
@import './SubMenu.pcss';
</style>
