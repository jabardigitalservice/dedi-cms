<template>
  <Maintenance />
</template>

<script>
export default {
  name: 'IndexPage',
  layout: 'Dashboard',
  mounted () {
    this.$store.commit('setPageName', 'Dashboard')
  },
  methods: {
    async logout () {
      await this.$auth.logout({ data: { refresh_token: this.$auth.strategy.refreshToken.get() } })
    }
  }
}
</script>
