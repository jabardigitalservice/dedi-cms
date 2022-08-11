<template>
  <div class="data-village">
    <SubHeader v-bind="headerDataVillage" />
    <div class="data-village__datatable">
      <div class="data-village__datatable-header">
        <div class="data-village__datatable-header-box-right">
          <BaseButton variant="secondary">
            <template #icon>
              <div class="data-village__datatable-header-add">
                <div class="data-village__datatable-header-plus-icon">
                  <jds-icon size="14px" name="plus-bold" />
                </div>
                Tambah Desa
              </div>
            </template>
          </BaseButton>
        </div>
        <jds-search
          v-model="search"
          small
          icon
          :button="false"
          class="data-village__datatable-header-search"
          placeholder="Cari Data"
        />
      </div>
      <BaseDataTable
        :headers="headerTableDataVillage"
        :items="dataVillage"
        :loading="$fetchState.pending"
        :pagination="pagination"
        @next-page="nextPage"
        @previous-page="previousPage"
        @page-change="pageChange"
        @per-page-change="perPageChange"
      >
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.action="{item}">
          <VillageTableAction
            @detail="$router.push(`/data-village/village/detail/${item.id}`)"
          />
        </template>
      </BaseDataTable>
    </div>
  </div>
</template>

<script>
import { headerDataVillage, headerTableDataVillage } from '@/constants/dataVillage'
export default {
  name: 'ComponentVillage',
  layout: 'Dashboard',
  data () {
    return {
      search: '',
      headerDataVillage,
      headerTableDataVillage,
      data: [],
      pagination: {
        currentPage: 1,
        totalRows: 0,
        itemsPerPage: 10,
        itemsPerPageOptions: [],
        disabled: false
      },
      query: {
        current_page: 1,
        per_page: 10
      }
    }
  },
  async fetch () {
    const response = await this.$axios.get('/villages/list-with-location', { params: this.query })
    const { data, meta } = response.data
    this.data = data || []
    this.pagination.currentPage = meta?.current_page || 1
    this.pagination.totalRows = meta?.total || 0
    this.pagination.itemsPerPage = meta?.per_page || this.query.per_page
  },
  computed: {
    dataVillage () {
      return this.data.map((item) => {
        return {
          ...item,
          districtName: item.district.name,
          cityName: item.city.name
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
@import './Village.pcss';
</style>
