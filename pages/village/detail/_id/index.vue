<template>
  <DesaDigitalDetail :item="data" />
</template>

<script>
export default {
  name: 'PagesVillageDetail',
  layout: 'Dashboard',
  async asyncData ({ params, $axios, error }) {
    try {
      const response = await $axios.get(`/questionnaires/${params.id}`)
      const data = response.data?.data
      return {
        data
      }
    } catch {
      error({ message: 'Gagal memuat data' })
    }
  }
}
</script>
