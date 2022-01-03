<template>
  <Maintenance />
</template>

<script>
export default {
  name: 'PageProject',
  layout: 'Dashboard',
  mounted () {
    this.$store.commit('setPageName', 'Project')
  }
}
</script>

<style>

</style>
