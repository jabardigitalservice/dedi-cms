<template>
  <div class="desa-digital">
    <SubMenu :menus="menus" @change="onChangeSubMenu" />
    <DesaDigitalLevelFour v-if="selectedSubMenu == 4" />
    <DesaDigital v-else :level="selectedSubMenu" />
  </div>
</template>

<script>
import { menus } from '@/constants/dataVillage'
export default {
  name: 'PageVillage',
  layout: 'Dashboard',
  data () {
    return {
      menus,
      selectedSubMenu: null
    }
  },
  mounted () {
    this.$store.commit('setPageName', 'Desa')
    this.$store.commit('setTrackPage', false)
  },
  methods: {
    onChangeSubMenu (value) {
      this.selectedSubMenu = value
      this.$store.commit('setSubMenu', value)
    }
  }
}
</script>

<style lang="postcss">
.desa-digital {
  @apply flex flex-col gap-[14px] min-h-[calc(100vh-72px-52px)];
}
</style>
