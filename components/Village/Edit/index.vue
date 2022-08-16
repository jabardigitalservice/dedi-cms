<template>
  <BaseModal
    :show="show"
    :loading="loading"
    :is-form-completed="isFormCompleted"
    label-right-btn="Simpan Perubahan"
    title="Ubah Data - Desa"
    @close="onModalClose"
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
            type="number"
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
            type="number"
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
      optionsLevel: [
        {
          value: null,
          label: 'Belum ada level'
        },
        {
          value: 1,
          label: 1
        },
        {
          value: 2,
          label: 2
        },
        {
          value: 3,
          label: 3
        },
        {
          value: 4,
          label: 4
        }
      ],
      isDisabledOptionDistricts: true,
      isFormCompleted: false
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
      },
      immediate: true
    },
    'form.id' () {
      // This pattern for checking user only allow input number and character (.)
      const formatText = /(?=.*[^\d.])/g
      if (formatText.test(this.form.id)) {
        this.form.id = ''
      }
      // formatId is pattern for id village maximal 13 chars (10 digit and 3 symbol) => XX.XX.XX.XXXX
      const formatId = /(\B(?=(\d{2})+(?!\d))(?=.{4}))/g
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
      const regexPoint = /^(-?\d+(\.\d+)?)$/
      if (regexPoint.test(this.form.longitude) || !this.form.latitude.length) {
        this.errors.longitude = null
      } else {
        this.errors.longitude = 'Format isian longitude salah'
      }
    },
    'form.latitude' () {
      if (this.form.latitude.length === '') {
        this.form.latitude = ''
      }
      const regexPoint = /^(-?\d+(\.\d+)?)$/
      if (regexPoint.test(this.form.latitude) || !this.form.latitude.length) {
        this.errors.latitude = null
      } else {
        this.errors.latitude = 'Format isian latitude salah'
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
    }
  }
}
</script>

<style lang="postcss">
@import './VillageEdit.pcss';
</style>
