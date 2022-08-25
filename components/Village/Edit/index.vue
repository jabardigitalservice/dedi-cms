<template>
  <BaseModal
    :show="show"
    :loading="loading"
    :is-form-completed="isFormCompleted"
    label-right-btn="Simpan Perubahan"
    title="Ubah Data - Desa"
    @close="onModalClose"
    @submit="showConfirmationModal"
  >
    <form v-if="show" class="form-edit-village" @submit.prevent>
      <div class="form-edit-village__form-group">
        <BaseInputText
          v-model="form.id"
          class="form-edit-village__form-group-field--label"
          name="id desa"
          label="Kode Wilayah Desa"
          type="text"
          placeholder="Masukkan kode wilayah desa"
          autocomplete="false"
          :error="!!(errors.villageId )"
        />
        <div v-if="errors.villageId" class="text-red-700">
          {{ errors.villageId }}
        </div>
      </div>
      <div class="form-edit-village__form-group">
        <BaseInputText
          v-model="form.name"
          class="form-edit-village__form-group-field--label"
          name="nama"
          label="Nama Desa"
          type="text"
          placeholder="Masukkan nama desa"
          autocomplete="false"
          :error="!!(errors.villageName)"
        />
        <div v-if="errors.villageName" class="text-red-700">
          {{ errors.villageName }}
        </div>
      </div>
      <div class="form-edit-village__form-group">
        <jds-select
          v-model="form.city_id"
          class="form-edit-village__form-group-field--label"
          name="kabupaten/kota"
          filterable
          label="Kabupaten/Kota"
          options-header="Kabupaten/Kota"
          :options="optionsCity"
          :error-message="errors.city"
          placeholder="Pilih Kabupaten/Kota"
        />
      </div>
      <div class="form-edit-village__form-group">
        <jds-select
          v-model="form.district_id"
          :disabled="isDisabledOptionDistricts"
          class="form-edit-village__form-group-field--label"
          name="Kecamatan"
          filterable
          label="Kecamatan"
          options-header="Kecamatan"
          :options="optionsDistrict"
          :error-message="errors.district"
          placeholder="Pilih Kecamatan"
        />
      </div>
      <div class="form-edit-village__form-group">
        <jds-select
          v-model="form.level"
          class="form-edit-village__form-group-field--label"
          name="Level Desa"
          label="Level Desa"
          :options="optionsLevel"
          placeholder="Pilih Level"
          :error-message="errors.villageLevel"
        />
      </div>
      <div class="form-edit-village__form-group form-edit-village__form-group--position">
        <div class="w-[250px]">
          <BaseInputText
            v-model="form.longitude"
            class="form-edit-village__form-group-field--label"
            name="longitude"
            label="Longitude"
            type="text"
            placeholder="Contoh: 6.219212"
            autocomplete="false"
            :error="!!(errors.longitude)"
          />
          <div v-if="errors.longitude" class="text-red-700">
            {{ errors.longitude }}
          </div>
        </div>
        <div class="w-[250px]">
          <BaseInputText
            v-model="form.latitude"
            class="form-edit-village__form-group-field--label"
            name="latitude"
            label="Latitude"
            type="text"
            placeholder="Contoh: 6.219212"
            autocomplete="false"
            :error="!!(errors.latitude)"
          />
          <div v-if="errors.latitude" class="text-red-700">
            {{ errors.latitude }}
          </div>
        </div>
      </div>
    </form>
  </BaseModal>
</template>

<script>
import { isEqual, cloneDeep } from 'lodash'
import { optionsLevel, formatText, formatId, regexPoint } from '@/constants/dataVillage'
export default {
  name: 'ComponentVillageEdit',
  props: {
    /**
     * make modal visible or not
     */
    show: {
      type: Boolean,
      default: false
    },
    /**
     * object of village
     */
    item: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      loading: false,
      form: {
        id: '',
        name: '',
        city_id: '',
        district_id: '',
        level: 0,
        longitude: '',
        latitude: ''
      },
      errors: {
        villageId: null,
        villageName: null,
        villageLevel: null,
        city: null,
        district: null,
        longitude: null,
        latitude: null
      },
      listCity: [],
      listDistrict: [],
      optionsLevel,
      isDisabledOptionDistricts: true,
      isChangedForm: false,
      cloneForm: {}
    }
  },
  computed: {
    optionsCity () {
      let city = []
      if (Array.isArray(this.listCity) && this.listCity.length) {
        city = this.listCity.map((item) => {
          return {
            value: item.id,
            label: item.name
          }
        })
      }
      return city
    },
    optionsDistrict () {
      let districts = []
      if (Array.isArray(this.listDistrict) && this.listDistrict.length) {
        districts = this.listDistrict.map((item) => {
          return {
            value: item.id,
            label: item.name
          }
        })
      }
      return districts
    },
    isFormCompleted () {
      return !!((
        this.form.id.length &&
        this.form.name.length &&
        (this.form.city_id === undefined || this.form.city_id.length) &&
        (this.form.district_id === undefined || this.form.district_id.length) &&
        !(this.form.level === 0 || this.form.level === undefined) &&
        this.form.longitude.length &&
        this.form.latitude.length &&
        !this.errors.villageId &&
        !this.errors.villageName &&
        !this.errors.city &&
        !this.errors.district &&
        !this.errors.longitude &&
        !this.errors.latitude &&
        this.isChangedForm
      ))
    }
  },
  watch: {
    show: {
      handler () {
        this.form = {
          ...this.form,
          ...this.item,
          city_id: this.item.city?.id,
          district_id: this.item.district?.id,
          longitude: this.item.location?.lng.toString(),
          latitude: this.item.location?.lat.toString()
        }
        if (this.district_id !== null || this.district_id !== '') { this.isDisabledOptionDistricts = false }
        this.fetchDistricts(this.form.city_id)
        this.cloneForm = cloneDeep(this.form)
      },
      immediate: true
    },
    form: {
      handler () {
        if (!isEqual(this.form, this.cloneForm)) {
          this.isChangedForm = true
        } else {
          this.isChangedForm = false
        }
      },
      deep: true
    },
    'form.id' () {
      if (formatText.test(this.form.id)) {
        this.form.id = ''
      }
      const newId = this.form.id.replaceAll(/[^0-9]/g, '').replace(formatId, '.')
      this.form.id = newId
      if (!this.form.id.length || this.form.id.length === 13) {
        this.errors.villageId = null
      } else {
        this.errors.villageId = 'Format isian kode wilayah salah'
      }
    },
    'form.name' () {
      if (this.form.name.length > 0 && this.form.name.length < 3) {
        this.errors.villageName = 'Isian nama minimal 3 karakter.'
      } else if (this.form.name.length > 100) {
        this.errors.villageName = 'Isian nama maksimal 100 karakter.'
      } else {
        this.errors.villageName = null
      }
    },
    'form.level' () {
      if (this.form.level === undefined) {
        this.errors.villageLevel = 'Isian level desa wajib diisi'
      } else {
        this.errors.villageLevel = null
      }
    },
    'form.longitude' () {
      if (regexPoint.test(this.form.longitude) || !this.form.longitude.length) {
        this.errors.longitude = null
      } else {
        this.errors.longitude = 'Format isian longitude salah'
      }
    },
    'form.latitude' () {
      if (regexPoint.test(this.form.latitude) || !this.form.latitude.length) {
        this.errors.latitude = null
      } else {
        this.errors.latitude = 'Format isian latitude salah'
      }
    },
    'form.city_id' (newId, oldId) {
      if (newId && newId !== oldId) {
        this.isDisabledOptionDistricts = false
        this.fetchDistricts(newId)
      } else {
        this.isDisabledOptionDistricts = true
      }

      if (newId === undefined) {
        this.errors.city = 'Isian Kabupaten/Kota wajib diisi'
      } else {
        this.errors.city = null
      }
    },
    'form.district_id' () {
      if (this.form.district_id === undefined) {
        this.errors.district = 'Isian Kecamatan wajib diisi'
      } else {
        this.errors.district = null
      }
    }
  },
  mounted () {
    this.fetchCity()
  },
  methods: {
    onModalClose () {
      this.$emit('close')
    },
    async fetchCity () {
      try {
        const response = await this.$axios.get('/cities/suggestion')
        this.listCity = response.data.data || []
      } catch {
        this.listCity = []
      }
    },
    async fetchDistricts (cityId) {
      try {
        const response = await this.$axios.get(`/districts/suggestion?city_id=${cityId}`)
        this.listDistrict = response.data.data || []
      } catch {
        this.listDistrict = []
      }
    },
    showConfirmationModal () {
      this.$store.dispatch('dialog/showDialog', {
        header: 'Konfirmasi Perubahan',
        title: 'Apakah Anda yakin dengan data yang telah dimasukkan?',
        btnLeftLabel: 'Cek Kembali',
        btnRightVariant: 'primary',
        btnLeftVariant: 'secondary',
        dialogType: 'confirmation',
        actionBtnRight: () => this.onSubmitChangeData(this.form)
      })
    },
    showProcessModal (percent) {
      this.$store.dispatch('dialog/showDialog', {
        header: 'Meyimpan Data Desa',
        title: 'Sedang proses menyimpan ...',
        dialogType: 'process',
        progressValue: percent
      })
    },
    closeDialogModal () {
      this.$store.dispatch('dialog/closeDialog')
    },
    async onSubmitChangeData (changeVillage) {
      await this.$axios.put(`/villages/${this.form.id}`, changeVillage, {
        onUploadProgress: function (progressEvent) {
          const percentCompleted = parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100))
          if (this.showProcessModal) { this.showProcessModal(percentCompleted) }
        }.bind(this)
      })
        .then(() => {
          this.$store.dispatch('dialog/showDialog', {
            header: 'Tambah Data Desa Berhasil',
            title: 'Desa yang Anda tambahkan berhasil disimpan.',
            message: `DESA DIGITAL - ${this.form.name}`,
            iconMessage: 'check-mark-circle',
            iconColor: 'text-green-700',
            btnLeftVariant: 'primary',
            btnLeftLabel: 'Saya mengerti',
            dialogType: 'information',
            actionBtnLeft: () => this.onModalClose()
          })
          this.$emit('stored')
        })
        .catch((error) => {
          const { response: { status, data: { errors } } } = error || {}
          if (status === 422 && errors) {
            this.errors.id = errors?.id || null
            this.errors.name = errors?.name || null
            this.errors.city_id = errors?.city_id || null
            this.errors.district_id = errors?.district_id || null
            this.errors.level = errors?.level || null
            this.errors.longitude = errors?.longitude || null
            this.errors.latitude = errors?.latitude || null
          }
          this.$store.dispatch('dialog/showDialog', {
            header: 'Tambah Data Desa Gagal',
            title: 'Project yang Anda buat gagal disimpan.',
            message: `DESA DIGITAL - ${this.form.name}`,
            iconMessage: 'warning',
            iconColor: 'text-red-700',
            btnLeftLabel: 'Keluar',
            btnLeftVariant: 'secondary',
            btnRightLabel: 'Coba Kembali',
            btnRightVariant: 'primary',
            dialogType: 'confirmation',
            actionBtnLeft: () => this.onModalClose(),
            actionBtnRight: () => this.closeDialogModal()
          })
        })
    }
  }
}
</script>

<style lang="postcss">
@import './VillageEdit.pcss';
</style>
