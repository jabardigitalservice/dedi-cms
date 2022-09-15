<template>
  <div class="desa-digital">
    <SubHeader v-bind="header" />
    <div class="desa-digital__datatable">
      <div class="desa-digital__datatable-header">
        <jds-search
          v-model="search"
          small
          icon
          :button="false"
          placeholder="Cari data"
          class="desa-digital__datatable-header-search"
        />
      </div>
      <BaseDataTable
        :headers="headerTableDesaDigital"
        :items="data"
        :pagination="pagination"
        @next-page="nextPage"
        @previous-page="previousPage"
        @page-change="pageChange"
        @per-page-change="perPageChange"
      />
    </div>
  </div>
</template>

<script>
import { headerDesaDigital, headerTableDesaDigital } from '@/constants/dataVillage'
import { generateItemsPerPageOptions } from '~/utils'

export default {
  name: 'ComponentDesaDigitalLevelOne',
  data () {
    return {
      header: headerDesaDigital[0],
      headerTableDesaDigital,
      search: '',
      data: [],
      pagination: {
        currentPage: 1,
        totalRows: 0,
        itemsPerPage: 5,
        itemsPerPageOptions: [],
        disabled: true
      }
    }
  },
  mounted () {
    this.pagination.itemsPerPageOptions = generateItemsPerPageOptions(this.pagination.itemsPerPage)
  },
  methods: {
    perPageChange (value) {
      if (value) {
        this.query.per_page = value
      }
      this.query.current_page = 1
    },
    pageChange (value) {
      this.query.current_page = value
    },
    nextPage (value) {
      this.query.current_page = value
    },
    previousPage (value) {
      this.query.current_page = value
    }
  }
}
</script>

<style lang="postcss">
@import '../DesaDigital.pcss';
</style>
