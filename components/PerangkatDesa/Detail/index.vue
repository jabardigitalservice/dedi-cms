<template>
  <div class="desa-detail">
    <div class="desa-detail__action">
      <BaseButton variant="primary" @click="goBack">
        <template #icon>
          <div class="desa-detail__action-button">
            <div class="desa-detail__action-icon">
              <IconArrowLeft />
            </div>
            Kembali
          </div>
        </template>
      </BaseButton>
      <div class="desa-detail__action-button">
        <BaseButton
          variant="secondary"
          label="Hapus Perangkat Desa"
          @click="deleteDataPartner(item)"
        />
        <BaseButton
          v-if="item.status === userStatus.waiting"
          variant="primary"
          label="Verifikasi Perangkat Desa"
          @click="verifyUser(item)"
        />
      </div>
    </div>
    <div class="desa-detail__content">
      <h1 class="desa-detail__content-header">
        Detail Perangkat Desa
      </h1>
      <jds-simple-table class="desa-detail__content-table">
        <thead>
          <tr>
            <th>Profil Perangkat Desa</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr>
            <td width="200">
              <strong>Nama</strong>
            </td>
            <td>{{ item.name || '-' }}</td>
          </tr>
          <tr>
            <td><strong>Email</strong></td>
            <td>{{ item.email || '-' }}</td>
          </tr>
          <tr>
            <td><strong>Desa</strong></td>
            <td>{{ item.village.name || '-' }}</td>
          </tr>
          <tr>
            <td><strong>Kecamatan</strong></td>
            <td>{{ item.district.name || '-' }}</td>
          </tr>
          <tr>
            <td><strong>Kota/Kabupaten</strong></td>
            <td>{{ item.city.name || '-' }}</td>
          </tr>
          <tr>
            <td><strong>Role</strong></td>
            <td class="capitalize">
              {{ item.role || '-' }}
            </td>
          </tr>
          <tr>
            <td><strong>Status</strong></td>
            <td>
              <span
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
              </span>
            </td>
          </tr>
          <tr>
            <td><strong>Dokumen SK</strong></td>
            <td>
              <BaseButton variant="tertiary-paddingless">
                <span class="pr-2.5">Dokumen SK</span>
                <IconPdf width="16" height="16" class="text-red-500" />
              </BaseButton>
            </td>
          </tr>
        </tbody>
      </jds-simple-table>

      <jds-simple-table class="desa-detail__content-table">
        <thead>
          <tr>
            <th>Log User</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr>
            <td width="200">
              <strong>Dibuat pada</strong>
            </td>
            <td>{{ formatDateTime(item.created_at) }}</td>
          </tr>
          <tr>
            <td><strong>Terakhir diupdate</strong></td>
            <td>{{ formatDateTime(item.updated_at) }}</td>
          </tr>
          <tr>
            <td><strong>Login terakhir</strong></td>
            <td>{{ formatDateTime(item.last_login_at) }}</td>
          </tr>
        </tbody>
      </jds-simple-table>
    </div>
    <BaseCustomDialog
      :show="isDialog"
      :header="contentPerangkatDesa.header"
      :title="contentPerangkatDesa.title"
      :data="contentPerangkatDesa.data"
    >
      <div v-if="contentPerangkatDesa.showNotes" class="mx-6 mb-6">
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
          'dialog__action-between': !contentPerangkatDesa.showNotes,
          'dialog__action-end': contentPerangkatDesa.showNotes
        }"
      >
        <div v-if="!contentPerangkatDesa.showNotes">
          <BaseButton
            label="Batal"
            variant="secondary"
            @click="onClose"
          />
        </div>
        <div v-if="!contentPerangkatDesa.showNotes">
          <BaseButton
            label="Tidak, tolak Perangkat Desa"
            variant="secondary"
            @click="rejectData"
          />
          <BaseButton
            label="Ya, terima Perangkat Desa"
            variant="primary"
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
          />
        </div>
      </div>
    </BaseCustomDialog>
  </div>
</template>

<script>
import IconArrowLeft from '~/assets/icons/arrow-left.svg?inline'
import IconPdf from '~/assets/icons/IconPdf.svg?inline'
import { formatDateTime } from '~/utils'
import { userStatus } from '@/constants/dataUser'

export default {
  name: 'ComponentPerangkatDesaDetail',
  components: { IconArrowLeft, IconPdf },
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      mItem: {},
      userStatus,
      formatDateTime,
      dataPerangkatDesa: null,
      isDialog: false,
      contentPerangkatDesa: {
        header: '',
        title: '',
        name: '',
        data: '',
        notes: '',
        showNotes: false,
        lengthNotes: 5000,
        error: null
      }
    }
  },
  watch: {
    item: {
      handler (val) {
        this.mItem = {
          ...val
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    refreshData () {
      this.$emit('updated')
    },
    goBack () {
      this.$store.commit('setSubMenu', 'PerangkatDesa')
      this.$store.commit('setTrackPage', true)
      this.$router.push('/data-user')
    },
    deleteDataPartner (item) {
      this.$store.dispatch('dialog/showDialog', {
        header: 'Hapus Perangkat Desa',
        title: 'Apakah Anda yakin akan menghapus data perangkat desa ini?',
        message: `${item.name} - ${item.village.name}`,
        btnRightVariant: 'danger',
        btnLeftVariant: 'secondary',
        actionBtnRight: () => this.actiondeleteDataPartner(item)
      })
    },
    async actiondeleteDataPartner (item) {
      try {
        const response = await this.$axios.delete(`/users/${item.id}`)
        if (response) {
          this.$store.dispatch('dialog/showDialog', {
            header: 'Hapus Data Perangkat Desa Berhasil',
            title: 'perangkat desa ini berhasil dihapus.',
            message: `${item.name} - ${item.village.name}`,
            dialogType: 'information',
            iconMessage: 'trash',
            iconColor: 'text-red-500',
            btnLeftLabel: 'Saya Mengerti',
            btnLeftVariant: 'primary',
            actionBtnLeft: () => this.$router.push('/data-user')
          })
        }
      } catch (error) {
        this.$store.dispatch('dialog/closeDialog')
        this.$store.dispatch('toast/showToast', { type: 'error', message: 'Data Desa gagal dihapus' })
      }
    },
    verifyUser (item) {
      this.dataPerangkatDesa = item
      const { name } = item
      this.contentPerangkatDesa.data = name
      this.contentPerangkatDesa.header = 'Verifikasi Perangkat Desa'
      this.contentPerangkatDesa.title = 'Apakah anda yakin ingin menerima Perangkat Desa ini?'
      this.isDialog = true
    },
    onClose () {
      this.isDialog = false
      this.contentPerangkatDesa.showNotes = false
      this.contentPerangkatDesa.notes = ''
      this.contentPerangkatDesa.error = null
    },
    rejectData () {
      const { email } = this.dataPerangkatDesa
      this.contentPerangkatDesa.data = email
      this.contentPerangkatDesa.header = 'Email Penolakan'
      this.contentPerangkatDesa.title = 'Dikirim kepada'
      this.contentPerangkatDesa.showNotes = true
    }
  }
}
</script>

<style lang="postcss" scoped>
@import '../Desa.pcss';
</style>
