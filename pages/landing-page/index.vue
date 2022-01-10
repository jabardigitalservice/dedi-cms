<template>
  <div class="flex flex-col gap-3">
    <SubMenu :menus="menus" @change="onChangeSubMenu" />
    <SubHeader v-bind="header" />
    <div class="py-[14px] px-6 rounded-lg bg-white">
      <BaseDataTable
        :headers="headerTable"
        :items="dataHeroBanner"
        :loading="$fetchState.pending"
        :pagination="pagination"
      />
    </div>
  </div>
</template>

<script>
import { headerTable, header, menus } from '@/constants/landingPage'
export default {
  name: 'PageLandingPage',
  layout: 'Dashboard',
  data () {
    return {
      selectedSubMenu: null,
      headerTable,
      header,
      menus,
      data: [],
      pagination: {
        currentPage: 1,
        totalRows: 0,
        itemsPerPage: 20,
        itemsPerPageOptions: [20, 40, 60, 80, 100],
        disabled: false
      }
    }
  },
  async fetch () {
    const response = await this.$axios.get('/pages')
    const { data, meta } = response.data
    this.data = data || []
    this.pagination.currentPage = meta?.current_page || 1
    this.pagination.totalRows = meta?.total || 0
    this.pagination.itemsPerPage = meta?.per_page || 20
  },
  computed: {
    dataHeroBanner () {
      return this.data.map((item) => {
        return {
          ...item,
          status: item.is_active === true ? 'Aktif' : 'Non-Aktif'
        }
      })
    }
  },
  mounted () {
    this.$store.commit('setPageName', 'Landing Page')
  },
  methods: {
    onChangeSubMenu (value) {
      this.selectedSubMenu = value
    }
  }
}
</script>

<style>

</style>
