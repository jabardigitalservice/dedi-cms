<template>
  <Maintenance />
</template>

<script>
export default {
  name: 'PageVillage',
  layout: 'Dashboard',
  mounted () {
    this.$store.commit('setPageName', 'Desa')
  }
}
</script>

<style>

</style>
