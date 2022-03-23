<template>
  <div class="admin">
    <div class="admin__datatable">
      <div class="admin__datatable-header">
        <div class="admin__datatable-header-box-right">
          <BaseButton variant="secondary" @click="addUserAdmin">
            <template #icon>
              <div class="admin__datatable-header-add">
                <div class="admin__datatable-header-plus-icon">
                  <jds-icon size="14px" name="plus-bold" />
                </div>
                Tambah Administrator
              </div>
            </template>
          </BaseButton>
          <div class="admin__datatable-header-filter-icon">
            <jds-icon name="filter-outline" size="16px" />
          </div>
          <span class="admin__datatable-header-filter-text">
            Filter :
          </span>
          <button type="button" class="admin__datatable-header-filter-dropdown">
            Belum ada filter
          </button>
        </div>
        <jds-search
          v-model="search"
          small
          icon
          :button="false"
          placeholder="Cari data"
          class="admin__datatable-header-search"
          @input="onSearch"
        />
      </div>
      <BaseDataTable
        :headers="headerTableUserAdmin"
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
        <template #item.action="{item}">
          <AdminTableAction
            :is-active="item.is_active"
            @edit="editUser(item)"
            @detail="detailUser(item)"
            @activate="activateUser(item)"
            @deactivate="deactivateUser(item)"
            @delete="deleteUser(item)"
          />
        </template>
      </BaseDataTable>
    </div>
    <AdminAdd :show="showModalAddAdmin" @added="refreshDatatable" @close="showModalAddAdmin = false" />
  </div>
</template>

<script>
import { debounce } from 'lodash'
import { headerTableUserAdmin } from '@/constants/dataUser'

export default {
  name: 'ComponentAdmin',
  layout: 'Dashboard',
  data () {
    return {
      search: '',
      headerTableUserAdmin,
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
        order_by: 'updated_at',
        current_page: 1,
        is_admin: true
      },
      showModalAddAdmin: false
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
          status: item.is_active ? 'Aktif' : 'Non-Aktif'
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
    searchTitle: debounce(function (value) {
      if (value.length > 2) {
        this.query.q = value
      } else {
        this.query.q = null
      }
    }, 500),
    onSearch (value) {
      this.searchTitle(value)
    },
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
        this.query.order_by = key === 'status' ? 'is_active' : key
      } else {
        this.query.order_by = 'updated_at'
        this.query.sort_by = 'desc'
      }
    },
    refreshDatatable () {
      this.query = {
        q: null,
        per_page: 5,
        sort_by: 'desc',
        order_by: 'updated_at',
        is_admin: true,
        current_page: 1
      }
      this.$fetch()
    },
    addUserAdmin () {
      this.showModalAddAdmin = true
    },
    editUser () {
      // @todo: edit user
    },
    async activateUser (item) {
      const { id } = item || null
      try {
        await this.$axios.patch(`/users/${id}/status`, { is_active: true })
        this.$fetch()
      } catch (error) {
        this.$store.dispatch('toast/showToast', { type: 'error', message: 'Gagal mengaktifkan user' })
      }
    },
    async deactivateUser (item) {
      const { id } = item || null
      try {
        await this.$axios.patch(`/users/${id}/status`, { is_active: false })
        this.$fetch()
      } catch (error) {
        this.$store.dispatch('toast/showToast', { type: 'error', message: 'Gagal menonaktifkan user' })
      }
    },
    deleteUser () {
      // @todo: delete user
    },
    detailUser () {
      // @todo: detail user
    }
  }
}
</script>

<style lang="postcss">
.admin {
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

      &-filter {

        &-text {
          @apply mx-2 text-blue-gray-800 text-sm leading-[23px];
        }

        &-icon {
          @apply w-5 h-5 text-blue-gray-800 ml-5;
        }

        &-dropdown {
          @apply bg-[#F7F9FC] px-3 py-2 text-[#788896] rounded-[27px] text-sm leading-[18px] font-normal;
        }
      }

      &-search {
        @apply justify-items-end w-[232px];
      }
    }

  }
}

</style>
