<template>
  <BaseModal
    :show="modalShow"
    :loading="loading"
    label-right-btn="Tambahkan"
    title="Tambah - Mitra Baru"
  >
    <form v-if="modalShow" class="form-add-partner" autocomplete="off">
      <div class="grid grid-cols-4">
        <div class="col-span-1">
          <div
            :class="{
              'form-add-partner__image': true,
              'form-add-partner__image--attached': isAttached
            }"
          >
            <img
              v-if="imageSource"
              class="form-add-partner__image--attached-uploaded"
              width="88"
              height="88"
              :src="imageSource"
              alt="Avatar User Admin"
            >
            <jds-icon v-else size="20px" name="user" />
          </div>
        </div>
        <div class="col-span-3">
          <div class="form-add-admin__title">
            Upload Foto Profile
          </div>
          <div>
            <div>
              Ukuran maksimal file adalah 1 Mb.
            </div>
            <div>
              File yang didukung adalah .jpg dan .png
            </div>
          </div>
          <div class="form-add-admin__button">
            <button class="form-add-admin__button-btn" type="button" @click="$refs.file.click()">
              Tambah File
              <jds-icon class="ml-2" size="12px" name="plus-bold" />
            </button>
            <input
              ref="file"
              type="file"
              hidden="true"
              accept="image/png, image/jpeg, image/svg+xml"
            >
          </div>
          <div v-if="fileImage">
            Filename: {{ fileImage.get('file').name }}
          </div>
          <div v-else-if="uploadFileErrorMessage" class="text-red-700">
            {{ uploadFileErrorMessage }}
          </div>
          <div v-else>
            Belum ada file terpilih.
          </div>
        </div>
      </div>
      <div class="form-add-partner__form-group">
        <jds-input-text
          v-model="form.name"
          name="nama"
          label="Nama User"
          placeholder="Masukkan nama User"
          autocomplete="false"
        />
        <div v-if="errors.name" class="text-red-700">
          {{ errors.name }}
        </div>
      </div>
      <div class="form-add-partner__form-group">
        <BaseInputText
          v-model="form.company"
          name="company"
          label="Nama Perusahaan"
          placeholder="Masukkan nama Mitra"
          type="company"
          autocomplete="off"
        />
        <div v-if="errors.company" class="text-red-700">
          {{ errors.company }}
        </div>
      </div>
      <div class="form-add-partner__form-group">
        <jds-input-text
          v-model="form.email"
          name="email"
          label="Email"
          type="email"
          placeholder="Masukkan alamat email"
          autocomplete="off"
        />
        <div v-if="errors.email" class="text-red-700">
          {{ errors.email }}
        </div>
      </div>
    </form>
  </BaseModal>
</template>

<script>
export default {
  name: 'MitraAdd',
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
      modalShow: false,
      loading: false,
      isAttached: false,
      form: {
        name: '',
        company: '',
        email: '',
        avatar: '',
        avatar_original_name: ''
      },
      imageSource: null,
      fileImage: null,
      uploadFileErrorMessage: '',
      errors: {
        name: null,
        company: null,
        email: null
      }
    }
  },
  watch: {
    show: {
      handler (val) {
        this.modalShow = val
      },
      immediate: true
    }
  }
}
</script>