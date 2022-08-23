<template>
  <div class="mitra">
    <div class="mitra__datatable">
      <div class="mitra__datatable-header">
        <div class="mitra__datatable-header-box-right">
          <BaseButton variant="secondary">
            <template #icon>
              <div class="mitra__datatable-header-add">
                <div class="mitra__datatable-header-plus-icon">
                  <jds-icon size="14px" name="plus-bold" />
                </div>
                Tambah Mitra
              </div>
            </template>
          </BaseButton>
        </div>
        <jds-search
          v-model="search"
          small
          icon
          :button="false"
          placeholder="Cari data"
          class="mitra__datatable-header-search"
        />
      </div>
      <BaseDataTable
        :headers="headerTableUserMitra"
        :items="dataUser"
        :loading="$fetchState.pending"
        :pagination="pagination"
        @next-page="nextPage"
        @previous-page="previousPage"
        @page-change="pageChange"
        @per-page-change="perPageChange"
        @change:sort="sortChange"
      >
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.customStatus="{item}">
          <span
            :class="{
              'mitra__status' : true,
              'mitra__status-green' : item.status_partner === statusPartner.verified,
              'mitra__status-yellow' : item.status_partner === statusPartner.waiting,
              'mitra__status-red' : item.status_partner === statusPartner.rejected,
              'mitra__status-blue' : item.status_partner === statusPartner.active,
              'mitra__status-gray' : item.status_partner === statusPartner.inactive,
            }"
          >
            {{ item.status_partner }}
          </span>
        </template>
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.action="{item}">
          <MitraTableAction
            :status="item.status_partner"
            @detail="$router.push(`/data-user/mitra/detail/${item.id}`)"
          />
        </template>
      </BaseDataTable>
    </div>
  </div>
</template>

<script>
import { headerTableUserMitra, statusPartner } from '@/constants/dataUser'
import { formatDate } from '~/utils'

export default {
  name: 'ComponentMitra',
  layout: 'Dashboard',
  data () {
    return {
      search: '',
      headerTableUserMitra,
      data: [],
      pagination: {
        currentPage: 1,
        totalRows: 0,
        itemsPerPage: 5,
        itemsPerPageOptions: [],
        disabled: false
      },
      query: {
        per_page: 5,
        sort_by: 'desc',
        order_by: 'users.created_at',
        current_page: 1,
        is_admin: false,
        roles: 'mitra'
      },
      statusPartner
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
          createdDate: formatDate(item.created_at),
          partnerName: item.partner.name || '-'
        }
      })
    },
    generateItemsPerPageOptions () {
      const options = []
      for (let i = 1; i <= 5; i++) {
        options.push(this.pagination.itemsPerPage * i)
      }
      return options
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
    this.pagination.itemsPerPageOptions = this.generateItemsPerPageOptions
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
    },
    sortChange (value) {
      const key = Object.keys(value)[0]
      if (key && value[key] !== 'no-sort') {
        this.query.sort_by = value[key]
        this.query.order_by = `users.${key}`
      } else {
        this.query.order_by = 'users.created_at'
        this.query.sort_by = 'desc'
      }
    }
  }
}
</script>

<style lang="postcss">
@import './Mitra.pcss';
</style>
