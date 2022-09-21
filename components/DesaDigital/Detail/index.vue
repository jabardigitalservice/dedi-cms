<template>
  <div class="desa-digital-detail">
    <div class="desa-digital-detail__action">
      <BaseButton variant="primary" @click="$router.go(-1)">
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
            <td>{{ item.properties.pemohon.nama || '-' }}</td>
          </tr>
          <tr>
            <td>
              <strong>No HP</strong>
              <span>:</span>
            </td>
            <td>{{ item.properties.pemohon.nomor_telepon || '-' }}</td>
          </tr>
          <tr>
            <td><strong>Email</strong></td>
            <td>{{ item.properties.pemohon.email || '-' }}</td>
          </tr>
        </tbody>
      </jds-simple-table>
      <h1 class="desa-digital-detail__content-header">
        Identitas Desa
      </h1>
      <jds-simple-table class="desa-digital-detail__content-table">
        <tbody>
          <tr>
            <td class="desa-digital-detail__content--width">
              <strong>No. Tlp Desa</strong>
            </td>
            <td>{{ '-' }}</td>
          </tr>
          <tr>
            <td><strong>Nama PIC Desa</strong></td>
            <td>{{ '-' }}</td>
          </tr>
          <tr>
            <td><strong>No. HP PIC Desa</strong></td>
            <td>{{ '-' }}</td>
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
            <th>Tentang Desa</th>
            <th />
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
            <th>Fasilitas Desa</th>
            <th />
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
            <td>{{ item.properties.fasilitas_desa.suplai_listrik.data || '-' }}</td>
          </tr>
          <tr>
            <td><strong>Jaringan Telepon</strong></td>
            <td>{{ item.properties.fasilitas_desa.jaringan_telepon.data || '-' }}</td>
          </tr>
          <tr>
            <td><strong>Jaringan Intener</strong></td>
            <td>{{ item.properties.fasilitas_desa.jaringan_internet.data || '-' }}</td>
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
      if (Array.isArray(this.item.properties.fasilitas_desa.akses_kendaraan.data)) {
        return this.item.properties.fasilitas_desa.akses_kendaraan.data.join(', ')
      } else {
        return '-'
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
  }
}
</script>
