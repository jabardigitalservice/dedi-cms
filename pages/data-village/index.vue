<template>
  <div>
    <Village v-if="!isMaintenance" />
    <Maintenance v-else />
  </div>
</template>

<script>
export default {
  name: 'PageDataVillage',
  layout: 'Dashboard',
  data () {
    return {
      isMaintenance: false
    }
  },
  mounted () {
    this.$store.commit('setPageName', 'Master Data - Desa')
  }
}
</script>
