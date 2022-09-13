<template>
  <div class="desa">
    <div class="desa__datatable">
      <div class="desa__datatable-header">
        <jds-search
          v-model="search"
          small
          icon
          :button="false"
          placeholder="Cari data"
          class="desa__datatable-header-search"
          @input="onSearch"
        />
      </div>
      <BaseDataTable
        :headers="headerTableUserDesa"
        :items="dataUser"
        :loading="$fetchState.pending"
        :pagination="pagination"
        @next-page="nextPage"
        @previous-page="previousPage"
        @page-change="pageChange"
        @per-page-change="perPageChange"
      >
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.customStatus="{item}">
          <div class="flex justify-center">
            <div
              :class="{
                'desa__status' : true,
                'desa__status-green' : item.status === userStatus.verified,
                'desa__status-yellow' : item.status === userStatus.waiting,
                'desa__status-red' : item.status === userStatus.rejected,
                'desa__status-blue' : item.status === userStatus.active,
                'desa__status-gray' : item.status === userStatus.inactive,
              }"
            >
              {{ item.status }}
            </div>
          </div>
        </template>
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.action="{item}">
          <PerangkatDesaTableAction
            :status="item.status"
            @delete="deleteData(item)"
            @verify="verifyUser(item)"
          />
        </template>
      </BaseDataTable>
    </div>
    <BaseCustomDialog
      :show="showDialogVerify"
      :header="contentPerangkatDesa.header"
      :title="contentPerangkatDesa.title"
      :data="contentPerangkatDesa.data"
    >
      <div v-if="contentPerangkatDesa.showNotes === true" class="mx-6 mb-6">
        <div class="mt-4 mb-2">
          Masukkan alasan penolakan Perangkat Desa
        </div>
        <textarea
          v-model.trim="contentPerangkatDesa.notes"
          class="desa__notes"
          name="Notes"
          placeholder="Masukkan disini"
          rows="6"
          maxlength="5000"
        />
        <div class="dialog__text">
          Tersisa {{ contentPerangkatDesa.lengthNotes }} karakter
        </div>
        <div v-if="contentPerangkatDesa.error" class="text-red-700">
          {{ contentPerangkatDesa.error }}
        </div>
      </div>
      <div
        :class="{
          'dialog__action': true,
          'dialog__action-between': contentPerangkatDesa.showNotes === false,
          'dialog__action-end': contentPerangkatDesa.showNotes === true
        }"
      >
        <div v-if="contentPerangkatDesa.showNotes === false">
          <BaseButton
            label="Batal"
            variant="secondary"
            @click="onClose"
          />
        </div>
        <div v-if="contentPerangkatDesa.showNotes === false">
          <BaseButton
            label="Tidak, tolak Perangkat Desa"
            variant="secondary"
            @click="onRejectData"
          />
          <BaseButton
            label="Ya, terima Perangkat Desa"
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
    </BaseCustomDialog>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'
import { headerTableUserDesa, userStatus } from '@/constants/dataUser'
import { generateItemsPerPageOptions } from '~/utils'

export default {
  name: 'ComponentPerangkatDesa',
  layout: 'Dashboard',
  data () {
    return {
      search: '',
      headerTableUserDesa,
      userStatus,
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
        roles: this.$config.userRoles.three
      },
      dataPerangkatDesa: null,
      showDialogVerify: false,
      contentPerangkatDesa: {
        header: '',
        title: '',
        name: '',
        data: '',
        notes: '',
        showNotes: false,
        lengthNotes: 5000,
        error: null
      },
      showModalAddPerangkatDesa: false
    }
  },
  async fetch () {
    try {
      const response = await this.$axios.get('/users', { params: this.query })
      const { data, meta } = response.data
      this.data = data || []
      this.pagination.currentPage = meta?.current_page || 1
      this.pagination.totalRows = meta?.total || 0
      this.pagination.itemsPerPage = meta?.per_page || this.query.per_page
    } catch (error) {
      this.pagination.disabled = true
    }
  },
  computed: {
    dataUser () {
      return this.data.map((item) => {
        return {
          ...item,
          desa: item.village.name || '-',
          kecamatan: item.district.name || '-',
          kabupaten: item.city.name || '-'
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
    },
    verifyUser (item) {
      this.dataPerangkatDesa = item
      const { name, partner } = item
      this.contentPerangkatDesa.data = partner?.name ? `${name} - ${partner.name}` : name
      this.contentPerangkatDesa.header = 'Verifikasi Perangkat Desa'
      this.contentPerangkatDesa.title = 'Apakah anda yakin ingin menerima Perangkat Desa ini?'
      this.showDialogVerify = true
    },
    onRejectData () {
      const { email } = this.dataPerangkatDesa
      this.contentPerangkatDesa.data = email
      this.contentPerangkatDesa.header = 'Email Penolakan'
      this.contentPerangkatDesa.title = 'Dikirim kepada'
      this.contentPerangkatDesa.showNotes = true
    },
    async onVerifyReject () {
      const { id } = this.dataPerangkatDesa
      try {
        const response = await this.$axios.put(`/users/${id}/verify`, { is_verify: false, notes: this.contentPerangkatDesa.notes })
        if (response) {
          this.onClose()
          this.$store.dispatch('dialog/showDialog', {
            header: 'Penolakan Perangkat Desa Berhasil',
            title: 'Penolakan Perangkat Desa telah berhasil dilakukan.',
            message: this.contentPerangkatDesa.data,
            detailMessage: 'Email terkait konfirmasi penolakan telah dikirimkan ke email Perangkat Desa bersangkutan.',
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
          this.contentPerangkatDesa.error = errors?.notes || null
        } else {
          this.onClose()
          this.$store.dispatch('dialog/showDialog', {
            header: 'Penolakan Perangkat Desa Gagal',
            title: 'Penolakan Perangkat Desa gagal dilakukan.',
            message: this.contentPerangkatDesa.data,
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
      const { id } = this.dataPerangkatDesa
      try {
        const response = await this.$axios.put(`/users/${id}/verify`, { is_verify: true })
        if (response) {
          this.onClose()
          this.$store.dispatch('dialog/showDialog', {
            header: 'Penerimaan Perangkat Desa Berhasil',
            title: 'Penerimaan Perangkat Desa telah berhasil dilakukan.',
            message: this.contentPerangkatDesa.data,
            detailMessage: 'Email terkait konfirmasi penerimaan telah dikirimkan ke email Perangkat Desa bersangkutan.',
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
          header: 'Penerimaan Perangkat Desa Gagal',
          title: 'Penerimaan Perangkat Desa gagal dilakukan.',
          message: this.contentPerangkatDesa.data,
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
      this.contentPerangkatDesa.showNotes = false
      this.contentPerangkatDesa.notes = ''
      this.contentPerangkatDesa.error = null
    },
    deleteData (item) {
      this.$store.dispatch('dialog/showDialog', {
        header: 'Hapus Perangkat Desa',
        title: 'Apakah Anda yakin akan menghapus data perangkat desa ini?',
        message: item.name,
        btnRightVariant: 'danger',
        btnLeftVariant: 'secondary',
        actionBtnRight: () => this.actionDeleteData(item)
      })
    },
    async actionDeleteData (item) {
      try {
        const response = await this.$axios.delete(`/users/${item.id}`)
        if (response) {
          this.$store.dispatch('dialog/showDialog', {
            header: 'Hapus Data Perangkat Desa Berhasil',
            title: 'Perangkat Desa ini berhasil dihapus.',
            message: item.name,
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
    }
  }
}
</script>

<style lang="postcss">
@import './Desa.pcss';
</style>
