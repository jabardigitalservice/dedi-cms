<template>
  <div class="data-user">
    <SubMenu :menus="menus" @change="onChangeSubMenu" />
    <Maintenance />
  </div>
</template>

<script>
import { menus } from '~/constants/dataUser'
export default {
  name: 'PageDataUser',
  layout: 'Dashboard',
  data () {
    return {
      menus,
      selectedSubMenu: 'admin'
    }
  },
  mounted () {
    this.$store.commit('setPageName', 'Master Data - User')
  },
  methods: {
    onChangeSubMenu (value) {
      this.selectedSubMenu = value
    }
  }
}
</script>

<style lang="postcss">
.data-user {
  @apply flex flex-col gap-[14px] min-h-[calc(100vh-72px-52px)];
}
</style>
