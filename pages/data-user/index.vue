<template>
  <Maintenance />
</template>

<script>
export default {
  name: 'PageDataUser',
  layout: 'Dashboard',
  mounted () {
    this.$store.commit('setPageName', 'Master Data - User')
  }
}
</script>

<style>

</style>
