<template>
  <BaseModal
    :show="modalShow"
    :loading="loading"
    :is-form-completed="isFormCompleted"
    label-right-btn="Simpan Perubahan"
    title="Ubah Data - Administrator"
    @submit="onSubmit"
    @close="onModalClose"
  >
    <form v-if="modalShow" class="form-edit-admin">
      <div class="grid grid-cols-4">
        <div class="col-span-1">
          <div
            :class="{
              'form-edit-admin__image': true,
              'form-edit-admin__image--attached': imageSource
            }"
          >
            <img
              v-if="imageSource"
              class="form-edit-admin__image--attached"
              width="88"
              height="88"
              :src="imageSource"
              alt="Avatar User Admin"
            >
            <jds-icon v-else size="20px" name="user" />
          </div>
        </div>
        <div class="col-span-3">
          <div class="form-edit-admin__title">
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
          <div class="form-edit-admin__button">
            <button class="form-edit-admin__button-btn" type="button" @click="$refs.file.click()">
              Ubah File
              <jds-icon class="ml-2" size="12px" name="pencil" />
            </button>
            <input
              ref="file"
              type="file"
              hidden="true"
              accept="image/png, image/jpeg, image/svg+xml"
              @change="onFileChange"
            >
          </div>
          <div v-if="form.fileImage">
            Filename: {{ form.fileImage.get('file').name }}
          </div>
          <div v-else-if="uploadFileErrorMessage" class="text-red-700">
            {{ uploadFileErrorMessage }}
          </div>
          <div v-else-if="!imageSource.length">
            Belum ada file terpilih.
          </div>
        </div>
      </div>
      <div class="form-edit-admin__form-group">
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
      <div class="form-edit-admin__form-group">
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
import { isEqual, cloneDeep } from 'lodash'
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
      isChangedForm: false,
      cloneForm: {},
      modalShow: undefined,
      isAttached: false,
      loading: false,
      form: {
        name: '',
        email: '',
        roles: this.$config.userRoles.one,
        avatar: '',
        avatar_original_name: '',
        fileImage: null
      },
      imageSource: '',
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
        !this.uploadFileErrorMessage.length &&
        this.isChangedForm
      ))
    }
  },
  watch: {
    show: {
      handler (val) {
        this.modalShow = val
        if (val && Object.keys(this.item).length) {
          this.form = {
            ...this.form,
            ...this.item
          }
          this.uploadFileErrorMessage = ''
          this.imageSource = this.item.avatar?.path
          this.cloneForm = cloneDeep(this.form)
        }
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
    'form.name' () {
      if (this.form.name.length < 3) {
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
    }
  },
  methods: {
    async onSubmit () {
      this.loading = true
      if (this.form.fileImage) {
        this.submitFile(this.form.fileImage)
          .then((response) => {
            const { source, original_name: originalName } = response || null
            this.form.avatar = source
            this.form.avatar_original_name = originalName
          })
          .then(async () => {
            try {
              await this.$axios.put(`/users/${this.form.id}`, this.form)
              this.$emit('close')
              this.$store.dispatch('toast/showToast', { type: 'success', message: 'Data berhasil disimpan' })
              this.$emit('stored')
            } catch (error) {
              const { response: { status, data: { errors } } } = error || {}
              if (status === 422 && errors) {
                this.errors.name = errors?.name || null
                this.errors.email = errors?.email || null
              }
              this.$store.dispatch('toast/showToast', { type: 'error', message: 'Data gagal disimpan, periksa kembali data yang dinputkan' })
            }
          })
          .catch(() => {
            this.$store.dispatch('toast/showToast', { type: 'error', message: 'Gambar gagal diupload' })
          }).finally(() => {
            this.loading = false
          })
      } else {
        try {
          this.form.avatar_original_name = this.form.avatar.original_name
          this.form.avatar = this.form.avatar.source
          await this.$axios.put(`/users/${this.form.id}`, this.form)
          this.$emit('close')
          this.$store.dispatch('toast/showToast', { type: 'success', message: 'Data berhasil diubah' })
          this.$emit('stored')
        } catch (error) {
          this.$store.dispatch('toast/showToast', { type: 'error', message: 'Data gagal diubah, periksa kembali data yang dinputkan' })
        } finally {
          this.loading = false
        }
      }
    },
    onModalClose () {
      this.$emit('close')
      this.$store.dispatch('dialog/closeDialog')
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
      this.form.fileImage = formData
      this.imageSource = URL.createObjectURL(value)
    },
    onFileChange () {
      if (this.$refs.file.files[0]) {
        const isValidFormat = ['image/png', 'image/jpeg'].includes(this.$refs.file.files[0].type)
        if (isValidFormat) {
          if (this.$refs.file.files[0].size > 1000000) {
            this.form.fileImage = null
            this.uploadFileErrorMessage = 'Gambar anda melebihi ukuran maksimal'
          } else {
            this.uploadFileErrorMessage = ''
            this.setFile(this.$refs.file.files[0])
          }
        } else {
          this.form.fileImage = null
          this.imageSource = ''
          this.uploadFileErrorMessage = 'Maaf file yang anda masukan tidak didukung'
        }
      } else {
        this.form.fileImage = null
        this.imageSource = ''
      }
    }
  }
}
</script>

<style lang="postcss">
.form-edit-admin {
  @apply text-sm leading-[23px] text-gray-800 py-4;

  &__image {
    @apply w-[88px] h-[88px] bg-gray-50 text-gray-400 flex justify-center items-center
    border border-gray-400 rounded-full box-border border-dashed stroke-dash-2;

    &--attached {
      @apply border-none overflow-hidden bg-cover;
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
