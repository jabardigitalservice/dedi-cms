<template>
  <div class="mitra">
    <div class="mitra__datatable">
      <div class="mitra__datatable-header">
        <div class="mitra__datatable-header-box-right">
          <BaseButton variant="secondary" @click="addNewMitra">
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
                'mitra__status-green' : item.status === userStatus.verified,
                'mitra__status-yellow' : item.status === userStatus.waiting,
                'mitra__status-red' : item.status === userStatus.rejected,
                'mitra__status-blue' : item.status === userStatus.active,
                'mitra__status-gray' : item.status === userStatus.inactive,
              }"
            >
              {{ item.status }}
            </div>
          </div>
        </template>
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.action="{item}">
          <MitraTableAction
            :status="item.status"
            @detail="$router.push(`/data-user/mitra/detail/${item.id}`)"
            @verify="verifyUser(item)"
            @delete="deleteDataPartner(item)"
            @activate="activateUser(item)"
            @deactivate="deactivateUser(item)"
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
        <div v-if="contentMitra.error" class="text-red-700">
          {{ contentMitra.error }}
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
    <MitraAdd :show="showModalAddMitra" @refresh="refreshDatatable" @close="showModalAddMitra = false" />
  </div>
</template>

<script>
import debounce from 'lodash.debounce'
import { headerTableUserMitra, userStatus } from '@/constants/dataUser'
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
        per_page: 5,
        sort_by: 'desc',
        order_by: 'users.created_at',
        current_page: 1,
        is_admin: false,
        roles: 'mitra'
      },
      userStatus,
      dataMitra: null,
      showDialogVerify: false,
      contentMitra: {
        header: '',
        title: '',
        name: '',
        data: '',
        notes: '',
        showNotes: false,
        lengthNotes: 5000,
        error: null
      },
      showModalAddMitra: false
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
      if (this.contentMitra.notes.length > 1) {
        this.contentMitra.error = null
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
      const { name, partner } = item
      this.contentMitra.data = partner?.name ? `${name} - ${partner.name}` : name
      this.contentMitra.header = 'Verifikasi Mitra'
      this.contentMitra.title = 'Apakah anda yakin ingin menerima mitra ini?'
      this.showDialogVerify = true
    },
    onRejectData () {
      const { email } = this.dataMitra
      this.contentMitra.data = email
      this.contentMitra.header = 'Email Penolakan'
      this.contentMitra.title = 'Dikirim kepada'
      this.contentMitra.showNotes = true
    },
    async onVerifyReject () {
      const { id } = this.dataMitra
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
        const { response: { status, data: { errors } } } = error
        if (status === 422 && errors) {
          this.contentMitra.error = errors?.notes || null
        } else {
          this.onClose()
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
      }
    },
    async onVerifyAccept () {
      const { id } = this.dataMitra
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
        this.onClose()
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
      this.contentMitra.notes = ''
      this.contentMitra.error = null
    },
    activateUser (item) {
      this.dataMitra = item
      const { name, partner } = item
      this.contentMitra.data = partner?.name ? `${name} - ${partner.name}` : name
      this.$store.dispatch('dialog/showDialog', {
        header: 'Aktifkan Mitra',
        title: 'Apakah anda yakin ingin mengaktifkan mitra ini?',
        message: this.contentMitra.data,
        btnRightLabel: 'Ya, aktifkan mitra ini',
        actionBtnRight: () => this.onActivateUser()
      })
    },
    async onActivateUser () {
      const { id } = this.dataMitra
      try {
        await this.$axios.patch(`/users/${id}/status`, { is_active: true })
        this.$store.dispatch('dialog/showDialog', {
          header: 'Pengaktifan Mitra Berhasil',
          title: 'Pengaktifan mitra telah berhasil dilakukan.',
          message: this.contentMitra.data,
          iconMessage: 'check-mark-circle',
          iconColor: 'text-green-700',
          btnLeftVariant: 'primary',
          btnLeftLabel: 'Saya mengerti',
          dialogType: 'information',
          actionBtnLeft: () => this.$fetch()
        })
      } catch (error) {
        this.$store.dispatch('dialog/showDialog', {
          header: 'Pengaktifan Mitra Gagal',
          title: 'Pengaktifan mitra gagal dilakukan.',
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
    deactivateUser (item) {
      this.dataMitra = item
      const { name, partner } = item
      this.contentMitra.data = partner?.name ? `${name} - ${partner.name}` : name
      this.$store.dispatch('dialog/showDialog', {
        header: 'Nonaktifkan Mitra',
        title: 'Apakah anda yakin ingin menonaktifkan mitra ini?',
        message: this.contentMitra.data,
        btnRightLabel: 'Ya, nonaktifkan mitra ini',
        actionBtnRight: () => this.onDeactivateUser()
      })
    },
    async onDeactivateUser () {
      const { id } = this.dataMitra
      try {
        await this.$axios.patch(`/users/${id}/status`, { is_active: false })
        this.$store.dispatch('dialog/showDialog', {
          header: 'Penonaktifan Mitra Berhasil',
          title: 'Penonaktifan mitra telah berhasil dilakukan.',
          message: this.contentMitra.data,
          iconMessage: 'check-mark-circle',
          iconColor: 'text-green-700',
          btnLeftVariant: 'primary',
          btnLeftLabel: 'Saya mengerti',
          dialogType: 'information',
          actionBtnLeft: () => this.$fetch()
        })
      } catch (error) {
        this.$store.dispatch('dialog/showDialog', {
          header: 'Penonaktifan Mitra Gagal',
          title: 'Penonaktifan mitra gagal dilakukan.',
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
    addNewMitra () {
      this.showModalAddMitra = true
    },
    refreshDatatable () {
      this.query = {
        per_page: 5,
        sort_by: 'desc',
        order_by: 'users.created_at',
        current_page: 1,
        is_admin: false,
        roles: 'mitra'
      }
      this.$fetch()
    },
    async actionDeleteDataPartner (item) {
      try {
        const response = await this.$axios.delete(`/users/${item.id}`)
        if (response) {
          this.$store.dispatch('dialog/showDialog', {
            header: 'Hapus Data Mitra Berhasil',
            title: 'Mitra ini berhasil dihapus.',
            message: `${item.name} - ${item.partner.name}`,
            dialogType: 'information',
            iconMessage: 'trash',
            iconColor: 'text-red-500',
            btnLeftLabel: 'Saya Mengerti',
            btnLeftVariant: 'primary',
            actionBtnLeft: () => this.refreshDatatable()
          })
        }
      } catch (error) {
        this.$store.dispatch('dialog/closeDialog')
        this.$store.dispatch('toast/showToast', { type: 'error', message: 'Data Desa gagal dihapus' })
      }
    },
    deleteDataPartner (item) {
      this.$store.dispatch('dialog/showDialog', {
        header: 'Hapus Mitra',
        title: 'Apakah Anda yakin akan menghapus data mitra ini?',
        message: `${item.name} - ${item.partner.name}`,
        btnRightVariant: 'danger',
        btnLeftVariant: 'secondary',
        actionBtnRight: () => this.actionDeleteDataPartner(item)
      })
    }
  }
}
</script>

<style lang="postcss">
@import './Mitra.pcss';
</style>
