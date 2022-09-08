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
        :items="dataUser"
        :loading="$fetchState.pending"
        :pagination="pagination"
        @next-page="nextPage"
        @previous-page="previousPage"
        @page-change="pageChange"
        @per-page-change="perPageChange"
      >
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.customStatus="{item}">
          <div class="flex justify-center">
            <div
              :class="{
                'mitra__status' : true,
                'mitra__status-green' : item.status === userStatus.verified,
                'mitra__status-yellow' : item.status === userStatus.waiting,
                'mitra__status-red' : item.status === userStatus.rejected,
                'mitra__status-blue' : item.status === userStatus.active,
                'mitra__status-gray' : item.status === userStatus.inactive,
              }"
            >
              {{ item.status }}
            </div>
          </div>
        </template>
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.action="{item}">
          <MitraTableAction
            :status="item.status"
          />
        </template>
      </BaseDataTable>
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
        disabled: false
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
  async fetch () {
    const response = await this.$axios.get('/users', { params: this.query })
    const { data, meta } = response.data
    this.data = data || []
    this.pagination.currentPage = meta?.current_page || 1
    this.pagination.totalRows = meta?.total || 0
    this.pagination.itemsPerPage = meta?.per_page || this.query.per_page
  },
  computed: {
    dataUser () {
      return this.data.map((item) => {
        return {
          ...item,
          desa: item.village.name || '-',
          kecamatan: item.district.name || '-',
          kabupaten: item.city.name || '-'
        }
      })
    }
  },
  watch: {
    query: {
      deep: true,
      handler () {
        this.$fetch()
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
