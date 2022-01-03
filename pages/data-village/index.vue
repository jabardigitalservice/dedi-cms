<template>
  <Maintenance />
</template>

<script>
export default {
  name: 'PageDataVillage',
  layout: 'Dashboard',
  mounted () {
    this.$store.commit('setPageName', 'Master Data - Desa')
  }
}
</script>

<style>

</style>
