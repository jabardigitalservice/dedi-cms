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
            <td>{{ applicantName }}</td>
          </tr>
          <tr>
            <td>
              <strong>No HP</strong>
              <span>:</span>
            </td>
            <td>{{ applicantPhoneNumber }}</td>
          </tr>
          <tr>
            <td><strong>Email</strong></td>
            <td>{{ applicantEmail }}</td>
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
            <td>{{ villageName }}</td>
          </tr>
          <tr>
            <td><strong>Kecamatan</strong></td>
            <td>{{ districtName || '-' }}</td>
          </tr>
          <tr>
            <td><strong>Kabupaten/Kota</strong></td>
            <td>{{ cityName }}</td>
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
            <td>{{ powerSupply }}</td>
          </tr>
          <tr>
            <td><strong>Jaringan Telepon</strong></td>
            <td>{{ cellularNetwork }}</td>
          </tr>
          <tr>
            <td><strong>Jaringan Intener</strong></td>
            <td>{{ internetNetwork }}</td>
          </tr>
        </tbody>
      </jds-simple-table>
      <jds-simple-table v-show="showDetailLevelTwo" class="desa-digital-detail__content-table">
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
            <td>{{ training }}</td>
          </tr>
        </tbody>
      </jds-simple-table>
      <jds-simple-table v-show="showDetailLevelThree" class="desa-digital-detail__content-table">
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
            <td>{{ bumdes }}</td>
          </tr>
          <tr>
            <td><strong>Komoditas yang dikelola BUMDesa</strong></td>
            <td>{{ commodities }}</td>
          </tr>
        </tbody>
      </jds-simple-table>
      <jds-simple-table v-show="showDetailLevelFour" class="desa-digital-detail__content-table">
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
            <td>{{ growthPotentials }}</td>
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
    showDetailLevelTwo () {
      return this.item.level === 2 || this.item.level === 3 || this.item.level === 4
    },
    showDetailLevelThree () {
      return this.item.level === 3 || this.item.level === 4
    },
    showDetailLevelFour () {
      return this.item.level === 4
    },
    applicantName () {
      return this.item.properties?.applicant?.name ?? '-'
    },
    applicantPhoneNumber () {
      return this.item.properties?.applicant?.phone_number ?? '-'
    },
    applicantEmail () {
      return this.item.properties?.applicant?.email ?? '-'
    },
    villageName () {
      return this.item.village?.name ?? '-'
    },
    districtName () {
      return this.item.district?.name ?? '-'
    },
    cityName () {
      return this.item.city?.name ?? '-'
    },
    vehicles () {
      return this.joinData(this.item.properties.facility?.vehicle_access?.data)
    },
    powerSupply () {
      return this.item.properties.facility?.power_supply?.data ?? '-'
    },
    cellularNetwork () {
      return this.item.properties.facility?.cellular_network?.data ?? '-'
    },
    internetNetwork () {
      return this.item.properties.facility?.internet_network?.data ?? '-'
    },
    communities () {
      return this.joinData(this.item.properties.literacy?.community?.data)
    },
    training () {
      return this.item.properties.literacy?.training?.data ?? '-'
    },
    socialMedias () {
      return this.joinData(this.item.properties.business?.social_media?.data)
    },
    bumdes () {
      return this.item.properties.business?.bumdes?.data ?? '-'
    },
    commodities () {
      return this.item.properties.business?.commodity?.data ?? '-'
    },
    potentials () {
      return this.joinData(this.item.properties?.potential?.data, this.item.properties.potential.other_potential)
    },
    growthPotentials () {
      return this.item.properties?.potential?.growth_potential || '-'
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
    joinData (data, otherData) {
      const newOtherData = otherData ?? ''
      if (Array.isArray(data)) {
        return data.join(', ') + `, ${newOtherData}`
      } else {
        return '-'
      }
    },
    goBack () {
      this.$store.commit('setTrackPage', true)
      this.$router.push('/village')
      switch (this.item.level) {
        case 1:
          this.$store.commit('setSubMenu', 1)
          break
        case 2:
          this.$store.commit('setSubMenu', 2)
          break
        case 3:
          this.$store.commit('setSubMenu', 3)
          break
        case 4:
          this.$store.commit('setSubMenu', 4)
      }
    }
  }
}
</script>

<style lang="postcss">
@import '../DesaDigital.pcss';
</style>
