<template>
  <div class="mitra-detail">
    <div class="mitra-detail__action">
      <BaseButton variant="primary" @click="goBack">
        <template #icon>
          <div class="mitra-detail__action-button">
            <div class="mitra-detail__action-icon">
              <IconArrowLeft />
            </div>
            Kembali
          </div>
        </template>
      </BaseButton>
      <div class="mitra-detail__action-button">
        <BaseButton
          variant="secondary"
          label="Hapus Mitra"
          @click="deleteDataPartner(item)"
        />
        <BaseButton
          v-if="item.status_partner === userStatus.waiting"
          variant="primary"
          label="Verifikasi Mitra"
        />
      </div>
    </div>
    <div class="mitra-detail__content">
      <h1 class="mitra-detail__content-header">
        Detail Mitra
      </h1>
      <jds-simple-table class="mitra-detail__content-table">
        <thead>
          <tr>
            <th>Profil Mitra</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr>
            <td width="200">
              <strong>Logo Mitra</strong>
            </td>
            <td>
              <img
                width="90"
                height="90"
                class="rounded-full object-cover w-[90px] h-[90px]"
                :src="item.avatar.path || defaultImgPath"
                :alt="item.name"
              >
            </td>
          </tr>
          <tr>
            <td><strong>Nama</strong></td>
            <td>{{ item.name || '-' }}</td>
          </tr>
          <tr>
            <td><strong>Nama Perusahaan</strong></td>
            <td>{{ item.partner.name || '-' }}</td>
          </tr>
          <tr>
            <td><strong>Email</strong></td>
            <td>{{ item.email || '-' }}</td>
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
                  'mitra__status' : true,
                  'mitra__status-green' : item.status_partner === userStatus.verified,
                  'mitra__status-yellow' : item.status_partner === userStatus.waiting,
                  'mitra__status-red' : item.status_partner === userStatus.rejected,
                  'mitra__status-blue' : item.status_partner === userStatus.active,
                  'mitra__status-gray' : item.status_partner === userStatus.inactive,
                }"
              >
                {{ item.status_partner }}
              </span>
            </td>
          </tr>
        </tbody>
      </jds-simple-table>

      <jds-simple-table class="mitra-detail__content-table">
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
  name: 'ComponentMitraDetail',
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
      formatDateTime,
      defaultImgPath: require('~/assets/icons/User_Default_Avatar.svg')
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
      this.$store.commit('setSubMenu', 'Mitra')
      this.$store.commit('setTrackPage', true)
      this.$router.push('/data-user')
    },
    deleteDataPartner (item) {
      this.$store.dispatch('dialog/showDialog', {
        header: 'Hapus Mitra',
        title: 'Apakah Anda yakin akan menghapus data mitra ini?',
        message: `${item.name} - ${item.partner.name}`,
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
            header: 'Hapus Data Mitra Berhasil',
            title: 'Mitra ini berhasil dihapus.',
            message: `${item.name} - ${item.partner.name}`,
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

<style lang="postcss">
@import '../Mitra.pcss';
</style>
