<template>
  <!-- eslint-disable vue/valid-v-slot -->
  <div class="testimonial">
    <SubHeader v-bind="headerTestimonials" />
    <div class="testimonial__datatable">
      <div class="testimonial__datatable-header">
        <div class="testimonial__datatable-header-box-right">
          <jds-search
            v-model="search"
            small
            icon
            :button="false"
            class="testimonial__datatable-header-search"
            @input="onSearchChange"
          />
          <div class="testimonial__datatable-header-filter-icon">
            <jds-icon name="filter-outline" size="16px" />
          </div>
          <span class="testimonial__datatable-header-filter-text">
            Filter :
          </span>
          <button type="button" class="testimonial__datatable-header-filter-dropdown">
            Belum ada filter
          </button>
        </div>
        <BaseButton variant="secondary" @click="addTestimonial">
          <template #icon>
            <div class="testimonial__datatable-header-add">
              <div class="testimonial__datatable-header-plus-icon">
                <jds-icon size="14px" name="plus-bold" />
              </div>
              Tambah Testimonial
            </div>
          </template>
        </BaseButton>
      </div>
      <BaseDataTable
        :headers="headerTableTestimonials"
        :items="listTestimonial"
        :loading="$fetchState.pending"
        :pagination="pagination"
        @next-page="nextPage"
        @previous-page="previousPage"
        @page-change="pageChange"
        @per-page-change="perPageChange"
        @change:sort="sortChange"
      >
        <template #item.action="{item}">
          <TestimonialsTableAction :item="item" />
        </template>
      </BaseDataTable>
    </div>
    <TestimonialsAdd :show="showAddTestimonials" @added="refreshDatatable" @close="showAddTestimonials = false" />
    <!-- in this PR this is unused code and next PR will be active -->
    <!-- <HeroBannerEdit :show="showEditHeroBanner" :item="itemHeroBanner" @stored="refreshDatatable" @close="showEditHeroBanner = false" /> -->
  </div>
</template>

<script>
import { debounce } from 'lodash'
import { headerTableTestimonials, headerTestimonials } from '@/constants/landingPage'
export default {
  name: 'ComponentTestimonials',
  data () {
    return {
      headerTableTestimonials,
      headerTestimonials,
      search: '',
      showAddTestimonials: false,
      testimonials: [],
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
        sort_by: null,
        order_by: null
      }
    }
  },
  async fetch () {
    const responses = await this.$axios.get('/testimonials', { params: this.query })
    const { data, meta } = responses.data || []
    this.testimonials = data
    this.pagination.currentPage = meta?.current_page || 1
    this.pagination.totalRows = meta?.total || 0
    this.pagination.itemsPerPage = meta?.per_page || this.query.per_page
  },
  computed: {
    listTestimonial () {
      return this.testimonials.map((item) => {
        return {
          name: item.name,
          role: item.type === 'mitra' ? 'Mitra' : 'Masyarakat',
          testimonial: item.description,
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
    addTestimonial () {
      this.showAddTestimonials = true
    },
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
        if (key === 'role') {
          this.query.order_by = 'type'
        } else if (key === 'status') {
          this.query.order_by = 'is_active'
        }
        this.query.sort_by = value[key]
      } else {
        this.query.order_by = null
        this.query.sort_by = null
      }
    }
  }
}
</script>

<style lang="postcss">
@import './Testimonials.pcss';
</style>
