<template>
  <BaseModal
    :show="true"
    label-right-btn="Tambahkan"
    title="Tambah - Desa"
  >
    <form v-if="true" class="form-add-village" autocomplete="off">
      <div class="form-add-village__form-group">
        <BaseInputText
          v-model="form.villageId"
          class="form-add-village__form-group-field--label"
          name="id desa"
          label="Kode Wilayah Desa"
          type="number"
          placeholder="Masukkan kode wilayah desa"
          autocomplete="false"
        />
        <div v-if="errors.villageId" class="text-red-700">
          {{ errors.villageId }}
        </div>
      </div>
      <div class="form-add-village__form-group">
        <jds-input-text
          v-model="form.villageName"
          class="form-add-village__form-group-field--label"
          name="nama"
          label="Nama Desa"
          placeholder="Masukkan nama desa"
          autocomplete="false"
        />
        <div v-if="errors.villageName" class="text-red-700">
          {{ errors.villageName }}
        </div>
      </div>
      <div class="form-add-village__form-group">
        <jds-select
          v-model="form.cityId"
          class="form-add-village__form-group-field--label"
          name="kabupaten/kota"
          filterable
          label="Kabupaten/Kota"
          options-header="Kabupaten/Kota"
          :options="optionsCity"
          placeholder="Pilih Kabupaten/Kota"
        />
      </div>
      <div class="form-add-village__form-group">
        <jds-select
          v-model="form.districtId"
          :disabled="isDisabledOptionDistricts"
          class="form-add-village__form-group-field--label"
          name="Kecamatan"
          filterable
          label="Kecamatan"
          options-header="Kecamatan"
          :options="optionsDistrict"
          placeholder="Pilih Kecamatan"
        />
      </div>
      <div class="form-add-village__form-group">
        <jds-select
          v-model="form.level"
          class="form-add-village__form-group-field--label"
          name="Level Desa"
          label="Level Desa"
          :options="optionsLevel"
          placeholder="Pilih Level"
          :error-message="errors.villageLevel"
        />
      </div>
      <div class="form-add-village__form-group flex flex-row-2 justify-between mb-4">
        <div class="w-[250px]">
          <jds-input-text
            v-model="form.longitude"
            class="form-add-village__form-group-field--label"
            name="longitude"
            label="Longitude"
            placeholder="Contoh: 6.219212"
            autocomplete="false"
          />
          <div v-if="errors.longitude" class="text-red-700">
            {{ errors.longitude }}
          </div>
        </div>
        <div class="w-[250px]">
          <jds-input-text
            v-model="form.latitude"
            class="form-add-village__form-group-field--label"
            name="latitude"
            label="Latitude"
            placeholder="Contoh: 6.219212"
            autocomplete="false"
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
  name: 'ComponentVillageAdd',
  data () {
    return {
      modalShow: false,
      loading: false,
      form: {
        villageId: '',
        villageName: '',
        cityId: null,
        districtId: null,
        level: '',
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
      isDisabledOptionDistricts: true
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
    'form.villageName' () {
      if (this.form.villageName.length < 3) {
        this.errors.villageName = 'Isian nama minimal 3 karakter.'
      } else if (this.form.villageName.length > 100) {
        this.errors.villageName = 'Isian nama maksimal 100 karakter.'
      } else {
        this.errors.villageName = ''
      }
    },
    'form.cityId' (newId, oldId) {
      if (newId && newId !== oldId) {
        this.isDisabledOptionDistricts = false
        this.districtId = null
        this.fetchDistricts(newId)
      } else {
        this.isDisabledOptionDistricts = true
      }
    },
    'form.level' () {
      if (this.form.level === undefined) {
        this.errors.villageLevel = 'Isian level desa wajib diisi'
      } else {
        this.errors.villageLevel = ''
      }
    }
  },
  mounted () {
    this.fetchCity()
  },
  methods: {
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
@import './VillageAdd.pcss';
</style>
