<template>
  <div class="landing-page">
    <SubMenu :menus="menus" @change="onChangeSubMenu" />
    <component :is="selectedSubMenu" />
  </div>
</template>

<script>
import { menus } from '@/constants/landingPage'
export default {
  name: 'PageLandingPage',
  layout: 'Dashboard',
  data () {
    return {
      menus,
      selectedSubMenu: null
    }
  },
  mounted () {
    this.$store.commit('setPageName', 'Landing Page')
    this.$store.commit('setTrackPage', false)
  },
  methods: {
    onChangeSubMenu (value) {
      this.selectedSubMenu = value
    }
  }
}
</script>

<style lang="postcss">
.landing-page {
  @apply flex flex-col gap-[14px] min-h-[calc(100vh-72px-52px)];
}
</style>
