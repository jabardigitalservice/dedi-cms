<template>
  <div class="village-detail">
    <div class="village-detail__action">
      <BaseButton variant="primary" @click="$router.go(-1)">
        <template #icon>
          <div class="village-detail__action-button">
            <div class="village-detail__action-icon">
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div v-html="require('~/assets/icons/arrow-left.svg?raw')" />
            </div>
            Kembali
          </div>
        </template>
      </BaseButton>
      <BaseButton variant="secondary">
        <template #icon>
          <div class="village-detail__action-button">
            <div class="village-detail__action-icon">
              <jds-icon size="14px" name="pencil" />
            </div>
            Ubah Data
          </div>
        </template>
      </BaseButton>
    </div>
    <div class="village-detail__content">
      <h1 class="village-detail__content-header">
        Detail Desa {{ item.name || '' }}
      </h1>
      <jds-simple-table class="village-detail__content-table">
        <thead>
          <tr>
            <th>Tentang Desa</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Kode Wilayah Desa</strong></td>
            <td>{{ item.id || '-' }}</td>
          </tr>
          <tr>
            <td><strong>Nama</strong></td>
            <td>{{ item.name || '-' }}</td>
          </tr>
          <tr>
            <td><strong>Kecamatan</strong></td>
            <td>{{ item.district.name || '-' }}</td>
          </tr>
          <tr>
            <td><strong>Kabupaten/Kota</strong></td>
            <td>{{ item.city.name || '-' }}</td>
          </tr>
          <tr>
            <td><strong>Level Desa</strong></td>
            <td>{{ item.level || '-' }}</td>
          </tr>
          <tr>
            <td><strong>Longitude</strong></td>
            <td>{{ item.location.lng || '-' }}</td>
          </tr>
          <tr>
            <td><strong>Latitude</strong></td>
            <td>{{ item.location.lat || '-' }}</td>
          </tr>
          <tr>
            <td>
              Lihat di Gmaps
            </td>
            <td />
          </tr>
        </tbody>
      </jds-simple-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComponentVillageDetail',
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
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
    formatDate (date) {
      if (date) {
        // format date from utc timezone to locale date string with custom format
        const newDate = new Date(date)
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
        const formattedDate = newDate.toLocaleDateString('id', options).replace(/\./g, ':')
        return formattedDate
      } else {
        return '-'
      }
    }
  }
}
</script>

<style lang="postcss">
@import './VillageDetail.pcss';
</style>
