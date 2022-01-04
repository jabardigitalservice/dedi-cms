<template>
  <Maintenance />
</template>

<script>
export default {
  name: 'PageDataOKR',
  layout: 'Dashboard',
  mounted () {
    this.$store.commit('setPageName', 'Master Data - OKR')
  }
}
</script>

<style>

</style>
