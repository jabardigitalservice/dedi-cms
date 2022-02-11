<template>
  <div class="herobanner">
    <SubHeader v-bind="headerHeroBanner" />
    <div class="herobanner__datatable">
      <div class="herobanner__datatable-header">
        <div class="herobanner__datatable-header-box-right">
          <BaseButton variant="secondary" @click="addHeroBanner">
            <template #icon>
              <div class="herobanner__datatable-header-add">
                <div class="herobanner__datatable-header-plus-icon">
                  <jds-icon size="14px" name="plus-bold" />
                </div>
                Tambah Hero Banner
              </div>
            </template>
          </BaseButton>
          <div class="herobanner__datatable-header-filter-icon">
            <jds-icon name="filter-outline" size="16px" />
          </div>
          <span class="herobanner__datatable-header-filter-text">
            Filter :
          </span>
          <button type="button" class="herobanner__datatable-header-filter-dropdown">
            Belum ada filter
          </button>
        </div>
        <jds-search
          v-model="search"
          small
          icon
          :button="false"
          class="herobanner__datatable-header-search"
          @input="onSearchChange"
        />
      </div>
      <BaseDataTable
        :headers="headerTableHeroBanner"
        :items="dataHeroBanner"
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
          <HeroBannerTableAction @edit="editHeroBanner(item)" @detail="$router.push(`/landing-page/hero-banner/detail/${item.id}`)" @delete="deleteHeroBanner(item)" />
        </template>
      </BaseDataTable>
    </div>
    <HeroBannerAdd :show="showAddHeroBanner" @added="refreshDatatable" @close="showAddHeroBanner = false" />
    <HeroBannerEdit :show="showEditHeroBanner" :item="itemHeroBanner" @stored="refreshDatatable" @close="showEditHeroBanner = false" />
  </div>
</template>

<script>
import { debounce } from 'lodash'
import { headerTableHeroBanner, headerHeroBanner } from '@/constants/landingPage'
export default {
  name: 'ComponentHeroBanner',
  layout: 'Dashboard',
  data () {
    return {
      search: '',
      headerTableHeroBanner,
      headerHeroBanner,
      showAddHeroBanner: false,
      showEditHeroBanner: false,
      itemHeroBanner: {},
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
        order_by: 'created_at',
        current_page: 1
      }
    }
  },
  async fetch () {
    const response = await this.$axios.get('/pages', { params: this.query })
    const { data, meta } = response.data
    this.data = data || []
    this.pagination.currentPage = meta?.current_page || 1
    this.pagination.totalRows = meta?.total || 0
    this.pagination.itemsPerPage = meta?.per_page || this.query.per_page
  },
  computed: {
    dataHeroBanner () {
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
    onSearchChange (value) {
      this.searchTitle(value)
    },
    refreshDatatable () {
      this.query = {
        q: null,
        per_page: 5,
        sort_by: 'desc',
        order_by: 'created_at',
        current_page: 1
      }
      this.$fetch()
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
        this.query.order_by = key === 'status' ? 'is_active' : ''
      } else {
        this.query.order_by = 'created_at'
        this.query.sort_by = 'desc'
      }
    },
    addHeroBanner () {
      this.showAddHeroBanner = true
    },
    editHeroBanner (item) {
      this.showEditHeroBanner = true
      this.itemHeroBanner = item
    },
    async actionBtnRight (id) {
      try {
        const response = await this.$axios.delete(`/pages/${id}`)
        if (response) {
          this.refreshDatatable()
          this.$store.dispatch('dialog/closeDialog')
        }
      } catch (error) {
        //
      }
    },
    deleteHeroBanner (item) {
      this.$store.dispatch('dialog/showDialog', {
        header: 'Hapus Hero Banner',
        title: 'Apakah Anda yakin akan menghapus Hero Banner ini?',
        message: item.title,
        btnRightVariant: 'danger',
        btnLeftVariant: 'secondary',
        actionBtnRight: () => this.actionBtnRight(item.id)
      })
    }
  }
}
</script>

<style lang="postcss">
@import './HeroBanner.pcss';
</style>
