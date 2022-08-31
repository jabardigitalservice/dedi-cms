<template>
  <BaseModal
    :show="modalShow"
    :loading="loading"
    :is-form-completed="isFormCompleted"
    label-right-btn="Tambahkan"
    title="Tambah - Administrator Baru"
    @submit="onSubmit"
    @close="onModalClose"
  >
    <form v-if="modalShow" class="form-add-admin" autocomplete="off">
      <div class="grid grid-cols-4">
        <div class="col-span-1">
          <div
            :class="{
              'form-add-admin__image': true,
              'form-add-admin__image--attached': isAttached
            }"
          >
            <img
              v-if="imageSource"
              class="form-add-admin__image--attached-uploaded"
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
          autocomplete="false"
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
          type="email"
          placeholder="Masukkan alamat email"
          autocomplete="off"
        />
        <div v-if="errors.email" class="text-red-700">
          {{ errors.email }}
        </div>
      </div>
      <div class="form-add-admin__form-group">
        <BaseInputText
          v-model="form.password"
          name="password"
          label="Kata Sandi"
          placeholder="Masukkan kata sandi"
          type="password"
          autocomplete="off"
        />
        <div v-if="errors.password" class="text-red-700">
          {{ errors.password }}
        </div>
      </div>
    </form>
  </BaseModal>
</template>

<script>
export default {
  name: 'ComponentAdminAdd',
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
      modalShow: undefined,
      isAttached: false,
      loading: false,
      form: {
        name: '',
        email: '',
        password: '',
        roles: this.$config.userRoles.one,
        avatar: '',
        avatar_original_name: ''
      },
      imageSource: null,
      fileImage: null,
      uploadFileErrorMessage: '',
      errors: {
        name: null,
        email: null,
        password: null
      }
    }
  },
  computed: {
    isFormCompleted () {
      return !!((
        this.form.name.length &&
        this.form.email.length &&
        this.form.password.length &&
        this.fileImage &&
        !this.uploadFileErrorMessage.length &&
        !this.errors.name &&
        !this.errors.email &&
        !this.errors.password
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
    },
    'form.email' () {
      // test format input text email using pattern
      const pattern = /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
      if (!pattern.test(this.form.email)) {
        this.errors.email = 'Isian email tidak valid.'
      } else {
        this.errors.email = ''
      }
    },
    'form.password' () {
      if (this.form.password.length < 8) {
        this.errors.password = 'Isian password minimal 8 karakter.'
      } else {
        this.errors.password = ''
      }
    }
  },
  methods: {
    onSubmit () {
      this.loading = true
      this.submitFile(this.fileImage)
        .then((response) => {
          const { source, original_name: originalName, path } = response || null
          this.form.avatar = source
          this.form.avatar_original_name = originalName
          this.imageSource = path
        })
        .then(async () => {
          try {
            await this.$axios.post('/users', this.form)
            this.$emit('close')
            this.$store.dispatch('toast/showToast', { type: 'success', message: 'Data berhasil disimpan' })
            this.$emit('added')
            this.resetForm()
          } catch (error) {
            const { response: { status, data: { errors } } } = error || {}
            if (status === 422 && errors) {
              this.errors.name = errors?.name || null
              this.errors.email = errors?.email || null
              this.errors.password = errors?.password || null
            }
            this.$store.dispatch('toast/showToast', { type: 'error', message: 'Data gagal disimpan, periksa kembali data yang dinputkan' })
          }
        })
        .catch(() => {
          this.$store.dispatch('toast/showToast', { type: 'error', message: 'Gambar gagal diupload' })
        }).finally(() => {
          this.loading = false
        })
    },
    onModalClose () {
      this.$emit('close')
      this.resetForm()
    },
    resetForm () {
      this.form = {
        name: '',
        email: '',
        password: '',
        roles: this.$config.userRoles.one,
        avatar: '',
        avatar_original_name: ''
      }
      this.imageSource = null
      this.fileImage = null
      this.isAttached = false
      this.uploadFileErrorMessage = ''
      this.loading = false
      this.errors = {
        name: null,
        email: null,
        password: null
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
            this.imageSource = null
          } else {
            this.uploadFileErrorMessage = ''
            this.isAttached = true
            this.setFile(this.$refs.file.files[0])
            this.imageSource = URL.createObjectURL(this.$refs.file.files[0])
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
