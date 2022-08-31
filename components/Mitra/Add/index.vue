<template>
  <BaseModal
    :show="modalShow"
    :is-form-completed="isFormCompleted"
    :loading="loading"
    label-right-btn="Tambahkan"
    title="Tambah - Mitra Baru"
    @submit="showConfirmationModal"
    @close="onModalClose"
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
import { rolesUser } from '@/constants/dataUser'
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
        roles: this.$config.userRoles.two,
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
    },
    'form.email' () {
      const pattern = /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
      if (pattern.test(this.form.email) || !this.form.email.length) {
        this.errors.email = ''
      } else {
        this.errors.email = 'Isian email tidak valid.'
      }
    }
  },
  methods: {
    setFile (value) {
      const formData = new FormData()
      formData.append('file', value)
      this.fileImage = formData
    },
    onFileChange () {
      if (this.$refs.file.files[0]) {
        const isValidFormat = ['image/png', 'image/jpeg'].includes(this.$refs.file.files[0].type)
        if (isValidFormat) {
          if (this.$refs.file.files[0].size > 1024 * 1024) {
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
    },
    resetForm () {
      this.form = {
        name: '',
        company: '',
        email: '',
        roles: rolesUser.mitra,
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
        company: null,
        email: null
      }
    },
    showConfirmationModal () {
      this.$store.dispatch('dialog/showDialog', {
        header: 'Konfirmasi Tambah Mitra',
        title: 'Apakah Anda yakin dengan data mitra yang akan ditambahkan?',
        btnLeftLabel: 'Cek Kembali',
        btnRightVariant: 'primary',
        btnLeftVariant: 'secondary',
        dialogType: 'confirmation',
        actionBtnRight: () => this.onSubmit(this.form)
      })
    },
    onModalClose () {
      this.$emit('close')
      this.resetForm()
      this.$emit('refresh')
    },
    closeDialogModal () {
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
    showProcessModal (percent) {
      this.$store.dispatch('dialog/showDialog', {
        header: 'Meyimpan Data Mitra',
        title: 'Sedang proses menyimpan ...',
        dialogType: 'process',
        progressValue: percent
      })
    },
    onSubmit (form) {
      this.loading = true
      this.submitFile(this.fileImage)
        .then((response) => {
          const { source, original_name: originalName, path } = response || null
          form.avatar = source
          form.avatar_original_name = originalName
          this.imageSource = path
        })
        .then(async () => {
          try {
            await this.$axios.post('/users', form, {
              onUploadProgress: function (progressEvent) {
                const percentCompleted = parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100))
                if (this.showProcessModal) { this.showProcessModal(percentCompleted) }
              }.bind(this)
            })
            this.$store.dispatch('dialog/showDialog', {
              header: 'Tambah Data Mitra Berhasil',
              title: 'Tambah data mitra berhasil disimpan.',
              message: `${this.form.name} - ${this.form.company}`,
              iconMessage: 'check-mark-circle',
              iconColor: 'text-green-700',
              btnLeftVariant: 'primary',
              btnLeftLabel: 'Saya mengerti',
              dialogType: 'information',
              actionBtnLeft: () => this.onModalClose()
            })
            this.resetForm()
          } catch (error) {
            const { response: { status, data: { errors } } } = error || {}
            if (status === 422 && errors) {
              this.errors.name = errors?.name || null
              this.errors.email = errors?.email || null
              this.errors.company = errors?.company || null
            }
            this.$store.dispatch('dialog/showDialog', {
              header: 'Tambah Data Mitra Gagal',
              title: 'Data Mitra yang  Anda tambahkan gagal disimpan.',
              message: `${this.form.name} - ${this.form.company}`,
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
          }
        })
        .catch(() => {
          this.$store.dispatch('toast/showToast', { type: 'error', message: 'Gambar gagal diupload' })
        }).finally(() => {
          this.loading = false
        })
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
