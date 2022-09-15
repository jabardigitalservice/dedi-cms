<template>
  <div class="desa-digital">
    <SubMenu :menus="menus" @change="onChangeSubMenu" />
    <component :is="selectedSubMenu" v-if="!isMaintenance" />
    <Maintenance v-else />
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
      selectedSubMenu: null,
      isMaintenance: false
    }
  },
  mounted () {
    this.$store.commit('setPageName', 'Desa')
    this.$store.commit('setTrackPage', false)
  },
  methods: {
    onChangeSubMenu (value) {
      this.selectedSubMenu = value

      if (menus.map(el => el.value).includes(value)) {
        this.isMaintenance = false
      } else {
        this.isMaintenance = true
      }
    }
  }
}
</script>

<style lang="postcss">
.desa-digital {
  @apply flex flex-col gap-[14px] min-h-[calc(100vh-72px-52px)];
}
</style>
