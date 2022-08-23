<template>
  <div class="mitra-detail">
    <div class="mitra-detail__action">
      <BaseButton variant="primary" @click="$router.go(-1)">
        <template #icon>
          <div class="mitra-detail__action-button">
            <div class="mitra-detail__action-icon">
              <IconArrowLeft />
            </div>
            Kembali
          </div>
        </template>
      </BaseButton>
      <BaseButton variant="secondary">
        <template #icon>
          <div class="mitra-detail__action-button">
            <div class="mitra-detail__action-icon">
              <jds-icon size="14px" name="pencil" />
            </div>
            Ubah Data
          </div>
        </template>
      </BaseButton>
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
            <td>{{ item.status_partner }}</td>
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
      formatDateTime,
      defaultImgPath: require('~/assets/icons//User_Default_Avatar.svg')
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
    }
  }
}
</script>

<style lang="postcss">
@import './MitraDetail.pcss';
</style>
