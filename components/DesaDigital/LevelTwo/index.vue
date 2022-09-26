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
          @input="onSearch"
        />
      </div>
      <BaseDataTable
        :headers="headerTableDesaDigital"
        :items="dataDesaDigital"
        :pagination="pagination"
        :loading="$fetchState.pending"
        @next-page="nextPage"
        @previous-page="previousPage"
        @page-change="pageChange"
        @per-page-change="perPageChange"
      >
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.action="{item}">
          <BaseButton variant="primary" label="Lihat Detail" @click="$router.push(`/village/detail/${item.id}`)" />
        </template>
      </BaseDataTable>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'
import { headerDesaDigital, headerTableDesaDigital } from '@/constants/dataVillage'
import { generateItemsPerPageOptions } from '~/utils'
export default {
  name: 'ComponentDesaDigitalLevelTwo',
  data () {
    return {
      header: headerDesaDigital[1],
      headerTableDesaDigital,
      search: '',
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
        current_page: 1,
        level: 2
      }
    }
  },
  async fetch () {
    try {
      const response = await this.$axios.get('/questionnaires', { params: this.query })
      const { data, meta } = response.data
      this.data = data || []
      this.pagination.currentPage = meta?.current_page || 1
      this.pagination.totalRows = meta?.total || 0
      this.pagination.itemsPerPage = meta?.per_page || this.query.per_page
      this.pagination.disabled = !(data.length)
    } catch {
      this.pagination.disabled = true
    }
  },
  computed: {
    dataDesaDigital () {
      return this.data.map((item) => {
        return {
          ...item,
          name: item.village?.name || '-',
          districtName: item.district?.name || '-',
          cityName: item.city?.name || '-',
          status: item.status || '-'
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
    searchTitle: debounce(function (value) {
      if (value.length > 2) {
        this.query.q = value
        this.$fetch()
      } else if (value.length === 0) {
        this.query.q = null
        this.$fetch()
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
    }
  }
}
</script>

<style lang="postcss">
@import '../DesaDigital.pcss';
</style>
