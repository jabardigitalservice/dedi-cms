<template>
  <Maintenance />
</template>

<script>
export default {
  name: 'PagePartner',
  layout: 'Dashboard',
  mounted () {
    this.$store.commit('setPageName', 'Mitra')
  }
}
</script>

<style>

</style>
