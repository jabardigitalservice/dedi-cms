<template>
  <BaseModal
    :show="modalShow"
    :loading="loading"
    :is-form-completed="isFormCompleted"
    label-right-btn="Tambahkan"
    title="Ubah Data - Administrator"
    @submit="onSubmit"
    @close="onModalClose"
  >
    <form v-if="modalShow" class="form-add-admin">
      <div class="grid grid-cols-4">
        <div class="col-span-1">
          <div
            :class="{
              'form-add-admin__image': true,
              'form-add-admin__image--attached': isAttached
            }"
          >
            <jds-icon v-if="!imageSource" size="14px" name="user" />
            <img
              v-else
              class="form-add-admin__image--attached-uploaded"
              width="88"
              height="88"
              :src="imageSource"
              alt="Avatar User Admin"
            >
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
              @change="onFileChange"
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
      <div class="form-add-admin__form-group">
        <jds-input-text
          v-model="form.name"
          name="nama"
          label="Nama Administrator"
          placeholder="Masukkan nama Administrator"
        />
        <div v-if="errors.name" class="text-red-700">
          {{ errors.name }}
        </div>
      </div>
      <div class="form-add-admin__form-group">
        <jds-input-text
          v-model="form.email"
          name="email"
          label="Email"
          placeholder="Masukkan alamat email"
          type="email"
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
  name: 'ComponentAdminEdit',
  props: {
    /**
     * make modal visible or not
     */
    show: {
      type: Boolean,
      default: false
    },
    /**
     * data admin
     */
    item: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      modalShow: undefined,
      isAttached: false,
      loading: false,
      form: {
        name: '',
        email: '',
        avatar: '',
        avatar_original_name: ''
      },
      imageSource: null,
      fileImage: null,
      uploadFileErrorMessage: '',
      errors: {
        name: null,
        email: null
      }
    }
  },
  computed: {
    isFormCompleted () {
      return !!((
        this.form.name.length &&
        this.form.email.length &&
        this.fileImage &&
        !this.uploadFileErrorMessage.length
      ))
    }
  },
  watch: {
    show: {
      handler (val) {
        this.modalShow = val
      },
      immediate: true
    }
  },
  methods: {
    async onSubmit () {
      this.loading = true
      try {
        await this.$axios.post('/users', this.form)
        this.$emit('close')
        this.$store.dispatch('toast/showToast', { type: 'success', message: 'Data berhasil diubah' })
        this.$emit('stored')
        this.resetForm()
      } catch (error) {
        const { response: { status, data: { errors } } } = error || {}
        if (status === 422 && errors) {
          this.errors.name = errors?.name || null
          this.errors.email = errors?.email || null
        }
        this.$store.dispatch('toast/showToast', { type: 'error', message: 'Data gagal diubah, periksa kembali data yang dinputkan' })
      }
    },
    onModalClose () {
      this.$emit('close')
      this.resetForm()
    },
    resetForm () {
      this.form = {
        name: '',
        email: '',
        avatar: '',
        avatar_original_name: ''
      }
      this.imageSource = null
      this.fileImage = null
      this.isAttached = false
      this.uploadFileErrorMessage = ''
      this.loading = false
      this.errrors = {
        name: null,
        email: null
      }
    },
    submitFile (image) {
      return new Promise((resolve, reject) => {
        this.$axios.post('/files/upload', image, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then((response) => {
          const { data } = response.data
          resolve(data)
        }).catch((error) => {
          reject(error)
        })
      })
    },
    setFile (value) {
      const formData = new FormData()
      formData.append('file', value)
      this.fileImage = formData
    },
    onFileChange () {
      if (this.$refs.file.files[0]) {
        const isValidFormat = ['image/png', 'image/jpeg'].includes(this.$refs.file.files[0].type)
        if (isValidFormat) {
          if (this.$refs.file.files[0].size > 1000000) {
            this.fileImage = null
            this.uploadFileErrorMessage = 'Gambar anda melebihi ukuran maksimal'
            this.isAttached = false
          } else {
            this.uploadFileErrorMessage = ''
            this.isAttached = true
            this.setFile(this.$refs.file.files[0])
            this.submitFile(this.fileImage)
              .then((response) => {
                const { source, original_name: originalName, path } = response || null
                this.form.avatar = source
                this.form.avatar_original_name = originalName
                this.imageSource = path
              })
              .catch(() => {
                this.$store.dispatch('toast/showToast', { type: 'error', message: 'Gambar gagal diupload' })
              }).finally(() => {
                this.loading = false
              })
          }
        } else {
          this.fileImage = null
          this.uploadFileErrorMessage = 'Maaf file yang anda masukan tidak didukung'
          this.isAttached = false
        }
      } else {
        this.fileImage = null
        this.isAttached = false
      }
    }
  }
}
</script>

<style lang="postcss">
.form-add-admin {
  @apply text-sm leading-[23px] text-gray-800 py-4;

  &__image {
    @apply w-[88px] h-[88px] bg-gray-50 text-gray-400 flex justify-center items-center
    border-2 border-gray-400 rounded-full box-border border-dashed stroke-dash-2;

    &--attached {
      @apply border-green-700 bg-green-50 overflow-hidden;

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
