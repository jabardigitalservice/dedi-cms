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
              'mitra__datatable-status-green' : item.status_partner === 'Terverifikasi',
              'mitra__datatable-status-yellow' : item.status_partner === 'Menunggu Verifikasi',
              'mitra__datatable-status-red' : item.status_partner === 'Ditolak',
              'mitra__datatable-status-blue' : item.status_partner === 'Aktif',
              'mitra__datatable-status-gray' : item.status_partner === 'Nonaktif',
            }"
          >
            {{ item.status_partner }}
          </span>
        </template>
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.action="{item}">
          <MitraTableAction
            :status="item.status_partner"
          />
        </template>
      </BaseDataTable>
    </div>
  </div>
</template>

<script>
import { headerTableUserMitra } from '@/constants/dataUser'
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
.mitra {
  @apply min-h-[calc(100vh-200px)] flex flex-col gap-[14px];

  &__datatable {
    @apply flex flex-col gap-[14px] py-[14px] px-6 rounded-lg bg-white;

    &-header {
      @apply flex items-center justify-between;

      &-box-right{
        @apply flex items-center;
      }

      &-add {
        @apply flex items-center gap-2;
      }

      &-plus-icon{
        @apply w-5 h-5 flex justify-center items-center;
      }

      &-search {
        @apply justify-items-end w-[232px];
      }
    }

    &-status {
      &-green {
        @apply px-4 py-[6px] rounded-[31px] bg-green-50 border border-green-400;
      }
      &-yellow {
        @apply px-4 py-[6px] rounded-[31px] bg-yellow-50 border border-yellow-400;
      }
      &-red {
        @apply px-4 py-[6px] rounded-[31px] bg-red-50 border border-red-400;
      }
      &-blue {
        @apply px-4 py-[6px] rounded-[31px] bg-blue-50 border border-blue-400;
      }
      &-gray {
        @apply px-4 py-[6px] rounded-[31px] bg-gray-200 border border-gray-400;
      }
    }

  }
}

</style>
