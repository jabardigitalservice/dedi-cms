<template>
  <HeroBannerDetail :item="data" />
</template>

<script>
export default {
  name: 'PagesHeroBannerDetail',
  layout: 'Dashboard',
  async asyncData ({ params, $axios }) {
    try {
      const response = await $axios.get(`/pages/${params.id}`)
      const data = response.data?.data
      return {
        data
      }
    } catch (error) {
      error({ message: 'Gagal memuat data' })
    }
  }
}
</script>
