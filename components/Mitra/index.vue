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
          @input="onSearch"
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
          <div class="flex justify-center">
            <div
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
            </div>
          </div>
        </template>
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.action="{item}">
          <MitraTableAction
            :status="item.status_partner"
            @detail="$router.push(`/data-user/mitra/detail/${item.id}`)"
            @verify="verifyUser(item)"
          />
        </template>
      </BaseDataTable>
    </div>
    <MitraDialog
      :show="showDialogVerify"
      :header="contentMitra.header"
      :title="contentMitra.title"
      :data="contentMitra.data"
    >
      <div v-if="contentMitra.showNotes === true" class="mx-6 mb-6">
        <div class="mt-4 mb-2">
          Masukkan alasan penolakan mitra
        </div>
        <textarea
          v-model.trim="contentMitra.notes"
          class="mitra__notes"
          name="Notes"
          placeholder="Masukkan disini"
          rows="6"
          maxlength="5000"
        />
        <div class="dialog__text">
          Tersisa {{ contentMitra.lengthNotes }} karakter
        </div>
      </div>
      <div
        :class="{
          'dialog__action': true,
          'dialog__action-between': contentMitra.showNotes === false,
          'dialog__action-end': contentMitra.showNotes === true
        }"
      >
        <div v-if="contentMitra.showNotes === false">
          <BaseButton
            label="Batal"
            variant="secondary"
            @click="onClose"
          />
        </div>
        <div v-if="contentMitra.showNotes === false">
          <BaseButton
            label="Tidak, tolak mitra ini"
            variant="secondary"
            @click="onRejectData"
          />
          <BaseButton
            label="Ya, terima mitra ini"
            variant="primary"
            @click="onVerifyAccept"
          />
        </div>
        <div v-else>
          <BaseButton
            label="Kembali"
            variant="secondary"
            @click="onClose"
          />
          <BaseButton
            label="Kirim Sekarang"
            variant="primary"
            @click="onVerifyReject"
          />
        </div>
      </div>
    </MitraDialog>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'
import { headerTableUserMitra, statusPartner } from '@/constants/dataUser'
import { formatDateTime } from '~/utils'

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
        q: null,
        per_page: 10,
        sort_by: 'desc',
        order_by: 'users.created_at',
        current_page: 3,
        is_admin: false,
        roles: 'mitra'
      },
      statusPartner,
      dataMitra: null,
      showDialogVerify: false,
      contentMitra: {
        header: '',
        title: '',
        name: '',
        data: '',
        notes: '',
        showNotes: false,
        lengthNotes: 5000
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
          createdDate: formatDateTime(item.created_at),
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
    },
    'contentMitra.notes' () {
      const maxLength = 5000
      this.contentMitra.lengthNotes = maxLength - this.contentMitra.notes.length
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
        this.query.order_by = `users.${key}`
      } else {
        this.query.order_by = 'users.created_at'
        this.query.sort_by = 'desc'
      }
    },
    verifyUser (item) {
      this.dataMitra = item
      const { name, partner } = item || null
      this.contentMitra.data = partner?.name ? `${name} - ${partner.name}` : name
      this.contentMitra.header = 'Verifikasi Mitra'
      this.contentMitra.title = 'Apakah anda yakin ingin menerima mitra ini?'
      this.showDialogVerify = true
    },
    onRejectData () {
      const { email } = this.dataMitra || null
      this.contentMitra.data = email
      this.contentMitra.header = 'Email Penolakan'
      this.contentMitra.title = 'Dikirim kepada'
      this.contentMitra.showNotes = true
    },
    async onVerifyReject () {
      const { id } = this.dataMitra || null
      try {
        const response = await this.$axios.put(`/users/${id}/verify`, { is_verify: false, notes: this.contentMitra.notes })
        if (response) {
          this.onClose()
          this.$store.dispatch('dialog/showDialog', {
            header: 'Penolakan Mitra Berhasil',
            title: 'Penolakan mitra telah berhasil dilakukan.',
            message: this.contentMitra.data,
            detailMessage: 'Email terkait konfirmasi penolakan telah dikirimkan ke email mitra bersangkutan.',
            iconMessage: 'check-mark-circle',
            iconColor: 'text-green-700',
            btnLeftVariant: 'primary',
            btnLeftLabel: 'Saya mengerti',
            dialogType: 'information',
            actionBtnLeft: () => this.$fetch()
          })
        }
      } catch (error) {
        this.$store.dispatch('dialog/showDialog', {
          header: 'Penolakan Mitra Gagal',
          title: 'Penolakan mitra gagal dilakukan.',
          message: this.contentMitra.data,
          iconMessage: 'warning',
          iconColor: 'text-red-700',
          btnLeftLabel: 'Keluar',
          btnLeftVariant: 'primary',
          dialogType: 'information',
          actionBtnLeft: () => this.$fetch()
        })
      }
    },
    async onVerifyAccept () {
      const { id } = this.dataMitra || null
      try {
        const response = await this.$axios.put(`/users/${id}/verify`, { is_verify: true })
        if (response) {
          this.onClose()
          this.$store.dispatch('dialog/showDialog', {
            header: 'Penerimaan Mitra Berhasil',
            title: 'Penerimaan mitra telah berhasil dilakukan.',
            message: this.contentMitra.data,
            detailMessage: 'Email terkait konfirmasi penerimaan telah dikirimkan ke email mitra bersangkutan.',
            iconMessage: 'check-mark-circle',
            iconColor: 'text-green-700',
            btnLeftVariant: 'primary',
            btnLeftLabel: 'Saya mengerti',
            dialogType: 'information',
            actionBtnLeft: () => this.$fetch()
          })
        }
      } catch (error) {
        this.$store.dispatch('dialog/showDialog', {
          header: 'Penerimaan Mitra Gagal',
          title: 'Penerimaan mitra gagal dilakukan.',
          message: this.contentMitra.data,
          iconMessage: 'warning',
          iconColor: 'text-red-700',
          btnLeftLabel: 'Keluar',
          btnLeftVariant: 'primary',
          dialogType: 'information',
          actionBtnLeft: () => this.$fetch()
        })
      }
    },
    onClose () {
      this.showDialogVerify = false
      this.contentMitra.showNotes = false
    }
  }
}
</script>

<style lang="postcss">
@import './Mitra.pcss';
</style>
