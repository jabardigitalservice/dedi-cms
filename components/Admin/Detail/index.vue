<template>
  <div class="admin-detail">
    <div class="admin-detail__action">
      <BaseButton variant="primary" @click="$router.go(-1)">
        <template #icon>
          <div class="admin-detail__action-button">
            <div class="admin-detail__action-icon">
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div v-html="require('~/assets/icons/arrow-left.svg?raw')" />
            </div>
            Kembali
          </div>
        </template>
      </BaseButton>
      <BaseButton variant="secondary" @click="showEditAdmin = true">
        <template #icon>
          <div class="admin-detail__action-button">
            <div class="admin-detail__action-icon">
              <jds-icon size="14px" name="pencil" />
            </div>
            Ubah Data
          </div>
        </template>
      </BaseButton>
    </div>
    <div class="admin-detail__content">
      <h1 class="admin-detail__content-header">
        Detail Administrator
      </h1>
      <jds-simple-table class="admin-detail__content-table">
        <thead>
          <tr>
            <th>Profil Administrator</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Foto Profil</strong></td>
            <td>
              <img width="90" height="90" class="rounded-full object-cover w-[90px] h-[90px]" :src="item.avatar.path" :alt="item.name">
            </td>
          </tr>
          <tr>
            <td><strong>Nama</strong></td>
            <td>{{ item.name || '-' }}</td>
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
            <td>{{ item.is_active ? 'Aktif' : 'Non-Aktif' }}</td>
          </tr>
        </tbody>
      </jds-simple-table>

      <jds-simple-table class="admin-detail__content-table">
        <thead>
          <tr>
            <th>Log User</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Dibuat pada</strong></td>
            <td>{{ formattedDate(item.created_at) }}</td>
          </tr>
          <tr>
            <td><strong>Terakhir diupdate</strong></td>
            <td>{{ formattedDate(item.updated_at) }}</td>
          </tr>
          <tr>
            <td><strong>Login terakhir</strong></td>
            <td>{{ formattedDate(item.last_login_at) }}</td>
          </tr>
        </tbody>
      </jds-simple-table>
    </div>
    <AdminEdit :show="showEditAdmin" :item="mItem" @stored="refreshData" @close="showEditAdmin = false" />
  </div>
</template>

<script>
import { formatInTimeZone } from 'date-fns-tz'
import { id } from 'date-fns/esm/locale'

export default {
  name: 'ComponentAdminDetail',
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      showEditAdmin: false,
      mItem: {}
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
    formattedDate (date) {
      if (date) {
        return formatInTimeZone(date, 'Asia/Jakarta', 'dd MMMM yyyy HH:mm:ss', { locale: id })
      } else {
        return '-'
      }
    }
  }
}
</script>

<style lang="postcss">
@import './AdminDetail.pcss';
</style>
