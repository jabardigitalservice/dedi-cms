<template>
  <div class="data-village">
    <SubHeader v-bind="headerDataVillage" />
    <div class="data-village__datatable">
      <div class="data-village__datatable-header">
        <div class="data-village__datatable-header-box-right">
          <BaseButton variant="secondary" @click="addVillage">
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
          @input="onSearch"
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
            @delete="deleteDataVillage(item)"
            @edit="editDataVillage(item)"
          />
        </template>
      </BaseDataTable>
    </div>
    <VillageAdd :show="showModalAddVillage" @close="showModalAddVillage = false" />
    <VillageEdit :show="showModalEditVillage" :item="itemVillage" @close="showModalEditVillage = false" />
  </div>
</template>

<script>
import { debounce } from 'lodash'
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
        name: null,
        current_page: 1,
        per_page: 10
      },
      showModalAddVillage: false,
      showModalEditVillage: false,
      itemVillage: {}
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
    searchTitle: debounce(function (value) {
      if (value.length > 2) {
        this.query.name = value
      } else {
        this.query.name = null
        this.query.current_page = 1
        this.query.per_page = 10
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
    refreshDatatable () {
      this.query = {
        per_page: 10,
        current_page: 1
      }
      this.$fetch()
    },
    addVillage () {
      this.showModalAddVillage = true
    },
    deleteDataVillage (item) {
      this.$store.dispatch('dialog/showDialog', {
        header: 'Hapus Data Desa',
        title: 'Apakah Anda yakin akan menghapus Data Desa ini?',
        message: `Desa Digital - ${item.name}`,
        btnRightVariant: 'danger',
        btnLeftVariant: 'secondary',
        actionBtnRight: () => this.actiondeleteDataVillage(item)
      })
    },
    async actiondeleteDataVillage (item) {
      try {
        const response = await this.$axios.delete(`/villages/${item.id}`)
        if (response) {
          this.refreshDatatable()
          this.$store.dispatch('dialog/showDialog', {
            header: 'Hapus Data Desa Berhasil',
            title: 'Desa ini berhasil dihapus',
            message: `Desa Digital - ${item.name}`,
            dialogType: 'information',
            iconMessage: 'trash',
            iconColor: 'text-red-500',
            btnLeftLabel: 'Saya Mengerti',
            btnLeftVariant: 'primary'
          })
        }
      } catch (error) {
        this.$store.dispatch('dialog/closeDialog')
        this.$store.dispatch('toast/showToast', { type: 'error', message: 'Data Desa gagal dihapus' })
      }
    },
    editDataVillage (item) {
      this.showModalEditVillage = true
      this.itemVillage = item
    }
  }
}
</script>

<style lang="postcss">
@import './Village.pcss';
</style>
