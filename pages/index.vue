<template>
  <div />
</template>

<script>
export default {
  name: 'IndexPage',
  layout: 'Dashboard',
  methods: {
    async logout () {
      await this.$auth.logout({ data: { refresh_token: this.$auth.strategy.refreshToken.get() } })
    }
  }
}
</script>
