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
              <button>
                Dokumen SK
              </button>
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
  </div>
</template>

<script>
import IconArrowLeft from '~/assets/icons/arrow-left.svg?inline'
import { formatDateTime } from '~/utils'
import { userStatus } from '@/constants/dataUser'

export default {
  name: 'ComponentPerangkatDesaDetail',
  components: { IconArrowLeft },
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
      formatDateTime
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
    }
  }
}
</script>

<style lang="postcss" scoped>
@import '../Desa.pcss';
</style>
