<template>
  <div class="desa-digital-detail">
    <div class="desa-digital-detail__action">
      <BaseButton variant="primary" @click="goBack">
        <template #icon>
          <div class="desa-digital-detail__action-button">
            <div class="desa-digital-detail__action-icon">
              <IconArrowLeft />
            </div>
            Kembali
          </div>
        </template>
      </BaseButton>
    </div>
    <div class="desa-digital-detail__content">
      <h1 class="desa-digital-detail__content-header">
        Identitas Pemohon
      </h1>
      <jds-simple-table class="desa-digital-detail__content-table">
        <tbody>
          <tr>
            <td class="desa-digital-detail__content--width">
              <strong>Nama Lengkap</strong>
              <span>:</span>
            </td>
            <td>{{ item.properties.applicant.name || '-' }}</td>
          </tr>
          <tr>
            <td>
              <strong>No HP</strong>
              <span>:</span>
            </td>
            <td>{{ item.properties.applicant.phone_number || '-' }}</td>
          </tr>
          <tr>
            <td><strong>Email</strong></td>
            <td>{{ item.properties.applicant.email || '-' }}</td>
          </tr>
        </tbody>
      </jds-simple-table>
    </div>
    <div class="desa-digital-detail__content">
      <h1 class="desa-digital-detail__content-header">
        Detail Desa {{ item.village.name || '' }}
      </h1>
      <jds-simple-table class="desa-digital-detail__content-table">
        <thead>
          <tr>
            <th colspan="2">
              Tentang Desa
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="desa-digital-detail__content--width">
              <strong>Nama</strong>
            </td>
            <td>{{ item.village.name || '-' }}</td>
          </tr>
          <tr>
            <td><strong>Kecamatan</strong></td>
            <td>{{ item.district.name || '-' }}</td>
          </tr>
          <tr>
            <td><strong>Kabupaten/Kota</strong></td>
            <td>{{ item.city.name || '-' }}</td>
          </tr>
        </tbody>
      </jds-simple-table>
      <jds-simple-table class="desa-digital-detail__content-table">
        <thead>
          <tr>
            <th colspan="2">
              Fasilitas Desa
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="desa-digital-detail__content--width">
              <strong>Akses Kendaraan</strong>
            </td>
            <td>{{ vehicles }}</td>
          </tr>
          <tr>
            <td><strong>Suplai Listrik</strong></td>
            <td>{{ item.properties.facility.power_supply.data || '-' }}</td>
          </tr>
          <tr>
            <td><strong>Jaringan Telepon</strong></td>
            <td>{{ item.properties.facility.cellular_network.data || '-' }}</td>
          </tr>
          <tr>
            <td><strong>Jaringan Intener</strong></td>
            <td>{{ item.properties.facility.internet_network.data || '-' }}</td>
          </tr>
        </tbody>
      </jds-simple-table>
      <jds-simple-table v-show="item.level === 2 || item.level === 3 || item.level === 4" class="desa-digital-detail__content-table">
        <thead>
          <tr>
            <th colspan="2">
              Literasi Desa
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="desa-digital-detail__content--width">
              <strong>Komunitas di Desa</strong>
            </td>
            <td>{{ communities }}</td>
          </tr>
          <tr>
            <td><strong>Pelatihan Literasi Digital</strong></td>
            <td>{{ item.properties.literacy.training.data || '-' }}</td>
          </tr>
        </tbody>
      </jds-simple-table>
      <jds-simple-table v-show="item.level === 3 || item.level === 4" class="desa-digital-detail__content-table">
        <thead>
          <tr>
            <th colspan="2">
              Tentang BUMDesa
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="desa-digital-detail__content--width">
              <strong>Sosial Media yang Dikelola</strong>
            </td>
            <td>{{ socialMedias }}</td>
          </tr>
          <tr>
            <td><strong>BumDesa</strong></td>
            <td>{{ item.properties.bumdes.bumdes.data || '-' }}</td>
          </tr>
          <tr>
            <td><strong>Komoditas yang dikelola BUMDesa</strong></td>
            <td>{{ item.properties.bumdes.commodity.data || '-' }}</td>
          </tr>
        </tbody>
      </jds-simple-table>
      <jds-simple-table v-show="item.level === 4" class="desa-digital-detail__content-table">
        <thead>
          <tr>
            <th colspan="2">
              Potensi Desa
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="desa-digital-detail__content--width">
              <strong>Kategori Potensi Desa</strong>
            </td>
            <td>{{ potentials }}</td>
          </tr>
          <tr>
            <td><strong>Keterangan</strong></td>
            <td>{{ item.properties.potential.growth_potential || '-' }}</td>
          </tr>
        </tbody>
      </jds-simple-table>
    </div>
  </div>
</template>

<script>
import IconArrowLeft from '~/assets/icons/arrow-left.svg?inline'
export default {
  name: 'ComponentDesaDigitalDetail',
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
  computed: {
    vehicles () {
      return this.joinDatas(this.item.properties.facility.vehicle_access.data)
    },
    communities () {
      return this.joinDatas(this.item.properties.literacy.community.data)
    },
    socialMedias () {
      return this.joinDatas(this.item.properties.bumdes.social_media.data)
    },
    potentials () {
      return this.joinDatas(this.item.properties.potential.data, this.item.properties.potential.other_potential)
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
    joinDatas (datas, otherDatas) {
      const newOtherDatas = otherDatas === undefined || otherDatas === null ? '' : `, ${otherDatas}`
      if (Array.isArray(datas)) {
        return datas.join(', ') + newOtherDatas
      } else {
        return '-'
      }
    },
    goBack () {
      this.$store.commit('setTrackPage', true)
      this.$router.push('/village')
      switch (this.item.level) {
        case 1:
          this.$store.commit('setSubMenu', 'DesaDigitalLevelOne')
          break
        case 2:
          this.$store.commit('setSubMenu', 'DesaDigitalLevelTwo')
          break
        case 3:
          this.$store.commit('setSubMenu', 'DesaDigitalLevelThree')
          break
        case 4:
          this.$store.commit('setSubMenu', 'DesaDigitalLevelFour')
      }
    }
  }
}
</script>

<style lang="postcss">
@import '../DesaDigital.pcss';
</style>
