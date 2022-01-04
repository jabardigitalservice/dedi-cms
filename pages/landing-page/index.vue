<template>
  <Maintenance />
</template>

<script>
export default {
  name: 'PageLandingPage',
  layout: 'Dashboard',
  mounted () {
    this.$store.commit('setPageName', 'Landing Page')
  }
}
</script>

<style>

</style>
