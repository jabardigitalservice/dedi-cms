<template>
  <div class="herobanner">
    <SubHeader v-bind="headerHeroBanner" />
    <div class="herobanner__datatable">
      <div class="herobanner__datatable-header">
        <div class="herobanner__datatable-header-box-right">
          <BaseButton variant="secondary">
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
      >
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.action="{item}">
          <HeroBannerTableAction :item="item" />
        </template>
      </BaseDataTable>
    </div>
  </div>
</template>

<script>
import { headerTableHeroBanner, headerHeroBanner } from '@/constants/landingPage'
export default {
  name: 'ComponentHeroBanner',
  layout: 'Dashboard',
  data () {
    return {
      search: '',
      headerTableHeroBanner,
      headerHeroBanner,
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
@import './HeroBanner.pcss';
</style>
