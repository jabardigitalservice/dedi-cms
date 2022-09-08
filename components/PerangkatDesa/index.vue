<template>
  <div class="desa">
    <div class="desa__datatable">
      <div class="desa__datatable-header">
        <jds-search
          v-model="search"
          small
          icon
          :button="false"
          placeholder="Cari data"
          class="desa__datatable-header-search"
        />
      </div>
      <BaseDataTable
        :headers="headerTableUserDesa"
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
import { headerTableUserDesa, userStatus } from '@/constants/dataUser'
import { generateItemsPerPageOptions } from '~/utils'

export default {
  name: 'ComponentPerangkatDesa',
  layout: 'Dashboard',
  data () {
    return {
      search: '',
      headerTableUserDesa,
      userStatus,
      data: [],
      pagination: {
        currentPage: 1,
        totalRows: 0,
        itemsPerPage: 5,
        itemsPerPageOptions: [],
        disabled: true
      },
      query: {
        q: null,
        per_page: 5,
        sort_by: 'desc',
        order_by: 'users.created_at',
        current_page: 1,
        is_admin: false,
        roles: this.$config.userRoles.three
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
@import './Desa.pcss';
</style>
