<template>
  <div class="village-detail">
    <div class="village-detail__action">
      <BaseButton variant="primary" @click="$router.go(-1)">
        <template #icon>
          <div class="village-detail__action-button">
            <div class="village-detail__action-icon">
              <IconArrowLeft />
            </div>
            Kembali
          </div>
        </template>
      </BaseButton>
      <BaseButton variant="secondary" @click="showEditVillage = true">
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
            <td>{{ item.level || 'Belum Ada' }}</td>
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
              <BaseButton
                v-if="item.location.lat && item.location.lng"
                type="button"
                label="Lihat di Gmaps"
                variant="primary"
                @click="onClickButton"
              />
            </td>
            <td />
          </tr>
        </tbody>
      </jds-simple-table>
    </div>
    <VillageEdit :show="showEditVillage" :item="mItem" @stored="refreshData" @close="showEditVillage = false" />
  </div>
</template>

<script>
import IconArrowLeft from '~/assets/icons/arrow-left.svg?inline'
export default {
  name: 'ComponentVillageDetail',
  components: { IconArrowLeft },
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      showEditVillage: false,
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
    onClickButton () {
      const { lng, lat } = this.item.location || null
      if (lng && lat) {
        window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank')
      }
    }
  }
}
</script>

<style lang="postcss">
@import '../Village.pcss';
</style>
