<template>
  <VillageDetail :item="data" @updated="updated" />
</template>

<script>
export default {
  name: 'PagesVillageDetail',
  layout: 'Dashboard',
  async asyncData ({ params, $axios }) {
    try {
      const response = await $axios.get(`/villages/${params.id}`)
      const data = response.data?.data
      return {
        data
      }
    } catch (error) {
      error({ message: 'Gagal memuat data' })
    }
  },
  methods: {
    async updated () {
      await this.$nuxt.refresh()
    }
  }
}
</script>
