<template>
  <div class="data-user">
    <SubMenu :menus="menus" @change="onChangeSubMenu" />
    <keep-alive v-if="!isMaintenance">
      <component :is="selectedSubMenu" />
    </keep-alive>
    <Maintenance v-else />

    <!-- @todo: remove component Maintenance after all menu developed -->
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
      selectedSubMenu: null,
      isMaintenance: false
    }
  },
  mounted () {
    this.$store.commit('setPageName', 'Master Data - User')
    this.$store.commit('setTrackPage', false)
  },
  methods: {
    onChangeSubMenu (value) {
      this.selectedSubMenu = value

      // @todo: remove after all menu developed
      if (value === 'Admin' || value === 'Mitra') {
        this.isMaintenance = false
      } else {
        this.isMaintenance = true
      }
    }
  }
}
</script>

<style lang="postcss">
.data-user {
  @apply flex flex-col gap-[14px] min-h-[calc(100vh-72px-52px)];
}
</style>
