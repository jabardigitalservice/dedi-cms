<template>
  <BaseModal
    :show="show"
    :loading="loading"
    :is-form-completed="isFormCompleted"
    label-right-btn="Simpan Perubahan"
    title="Ubah Data - Desa"
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
      isDisabledOptionDistricts: true
    }
  }
}
</script>

<style lang="postcss">
@import './VillageEdit.pcss';
</style>
