<template>
  <BaseModal
    :show="true"
    :is-form-completed="isFormCompleted"
    :loading="loading"
    label-right-btn="Tambahkan"
    title="Tambah - Mitra Baru"
  >
    <form v-if="true" class="form-add-partner" autocomplete="off">
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
        <BaseInputText
          v-model="form.name"
          name="nama"
          label="Nama User"
          type="text"
          placeholder="Masukkan nama User"
          autocomplete="false"
          :error="!!(errors.name)"
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
          type="text"
          placeholder="Masukkan nama Mitra"
          autocomplete="off"
          :error="!!(errors.company)"
        />
        <div v-if="errors.company" class="text-red-700">
          {{ errors.company }}
        </div>
      </div>
      <div class="form-add-partner__form-group">
        <BaseInputText
          v-model="form.email"
          name="email"
          label="Email"
          type="email"
          placeholder="Masukkan alamat email"
          autocomplete="off"
          :error="!!(errors.email)"
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
  computed: {
    isFormCompleted () {
      return !!((
        this.form.name.length &&
        this.form.company.length &&
        this.form.email.length &&
        this.fileImage &&
        !this.uploadFileErrorMessage.length &&
        !this.errors.name &&
        !this.errors.company &&
        !this.errors.email
      ))
    }
  },
  watch: {
    show: {
      handler (val) {
        this.modalShow = val
      },
      immediate: true
    },
    'form.name' () {
      if (this.form.name.length > 0 && this.form.name.length < 3) {
        this.errors.name = 'Isian nama minimal 3 karakter.'
      } else {
        this.errors.name = ''
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.form-add-partner {
  @apply py-4 text-sm leading-[23px] text-gray-800;

  &__image {
    @apply w-[88px] h-[88px] bg-gray-50 text-gray-400 flex justify-center items-center
    border border-gray-400 rounded-full box-border border-dashed stroke-dash-2;

    &--attached {
      @apply border-none overflow-hidden;

    &--uploaded {
      @apply bg-cover;
    }
    }
  }

  &__title {
    @apply font-roboto text-gray-900 text-base leading-[23px] font-medium mb-1;
  }

  &__button {
    @apply my-3 relative inline-block;

    &-btn {
      @apply bg-green-700 text-white w-[135px] h-[38px]
      text-sm py-[9px] font-sans font-bold rounded-lg;

      &:hover {
        @apply bg-green-800;
      }
    }

    input[type=file] {
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
    }
  }

  &__form-group {
    @apply mt-6 w-full;
  }
}
</style>
