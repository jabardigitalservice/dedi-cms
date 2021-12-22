<template>
  <div>
    <button @click="logout">
      Logout
    </button>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  methods: {
    async logout () {
      await this.$auth.logout({ data: { refresh_token: this.$auth.strategy.refreshToken.get() } })
    }
  }
}
</script>
