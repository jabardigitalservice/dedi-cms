<template>
  <BaseModal
    :show="mShow"
    :loading="loading"
    :is-form-completed="isFormCompleted"
    label-right-btn="Tambah"
    title="Tambah - Hero Banner"
    @submit="onSubmit"
    @close="onModalClose"
  >
    <form v-if="mShow" class="form-add-hero-banner">
      <div class="form-add-hero-banner__title">
        Upload file
      </div>
      <div>
        <div>
          Ukuran maksimal file adalah 1 Mb.
        </div>
        <div>
          File yang didukung adalah .svg, .jpg dan .png
        </div>
      </div>
      <div
        :class="{
          'form-add-hero-banner__box-upload-file': true,
          'form-add-hero-banner__box-upload-file--dragover': isDragOver
        }"
        @drop.prevent="onFileDrop"
        @drag.prevent
        @dragenter.prevent="dragOver"
        @dragover.prevent="dragOver"
        @dragleave.prevent="dragLeave"
        @dragend.prevent="dragLeave"
      >
        <div class="form-add-hero-banner__box-upload-file-wrapper">
          <jds-icon
            name="plus-circle-outline"
            size="30px"
            class="form-add-hero-banner__box-upload-file-icon"
            @click="$refs.file.click()"
          />
          <div>
            Seret dan lepaskan file disini.
          </div>
          <div>
            atau <span class="form-add-hero-banner__box-upload-file-title-click" @click="$refs.file.click()">klik untuk upload</span>
          </div>
        </div>
        <!-- eslint-disable no-trailing-spaces -->
        <input 
          ref="file" 
          name="file" 
          type="file" 
          accept="image/png, image/jpeg, image/svg+xml" 
          hidden="true" 
          @change="onFileChange" 
        >
      </div>
      <div v-if="form.fileImage">
        Filename: {{ form.fileImage.get('file').name }}
      </div>
      <div v-else-if="dropFileErrorMessage" class="text-red-700">
        {{ dropFileErrorMessage }}
      </div>
      <div v-else>
        Belum ada file terpilih
      </div>
      <div class="form-add-hero-banner__form-group">
        <jds-select
          v-model="form.order"
          name="urutan"
          options-header="Urutan"
          filterable
          :options="optionsOrderBanner"
          label="Urutan Banner"
          placeholder="Pilih urutan"
        />
      </div>
      <div class="form-add-hero-banner__form-group">
        <jds-input-text 
          v-model="form.title"
          name="judul"
          label="Judul Hero Banner"
          placeholder="Masukan judul"
        />
      </div>
      <div class="form-add-hero-banner__form-group">
        <jds-input-text
          v-model="form.link"
          name="link"
          label="Link"
          :error-message="linkErrorMessage"
          placeholder="Masukan link"
          @input="onLinkInput"
        />
      </div>
      <div class="form-add-hero-banner__form-group">
        <jds-radio-button-group
          v-model="form.is_active"
          name="hero-banner-status"
          orientation="horizontal"
          :items="optionsStatus"
          label="Status Hero Banner"
          placeholder="Masukan judul"
        />
      </div>
    </form>
  </BaseModal>
</template>

<script>
export default {
  name: 'ComponentHeroBannerAdd',
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
      mShow: undefined,
      isDragOver: false,
      loading: false,
      form: {
        title: '',
        order: null,
        link: '',
        is_active: 'true',
        image: '',
        image_original_name: '',
        fileImage: null
      },
      linkErrorMessage: '',
      dropFileErrorMessage: '',
      optionsStatus: [
        {
          value: 'true',
          placeholder: 'Aktif'
        },
        {
          value: 'false',
          placeholder: 'Non Aktif'
        }
      ]
    }
  },
  computed: {
    optionsOrderBanner () {
      const options = []
      for (let i = 1; i <= 5; i++) {
        options.push(i)
      }
      return options
    },
    isFormCompleted () {
      return !!((
        this.form.title.length &&
        this.form.link.length &&
        this.form.order &&
        this.form.is_active &&
        this.form.fileImage &&
        !this.linkErrorMessage.length &&
        !this.dropFileErrorMessage.length
      ))
    }
  },
  watch: {
    show: {
      handler (val) {
        this.mShow = val
      },
      immediate: true
    }
  },
  methods: {
    onSubmit () {
      this.loading = true
      this.submitFile(this.form.fileImage)
        .then((response) => {
          this.form.image = response.source
          this.form.image_original_name = response.original_name
        })
        .then(async () => {
          try {
            await this.$axios.post('/pages', this.form)
            this.$emit('close')
            this.$store.dispatch('toast/showToast', { type: 'success', message: 'Data berhasil disimpan' })
            this.$emit('added')
            this.resetForm()
          } catch (error) {
            this.$store.dispatch('toast/showToast', { type: 'error', message: 'Data gagal disimpan, periksa kembali data yang dinputkan' })
          }
        })
        .catch(() => {
          this.$store.dispatch('toast/showToast', { type: 'error', message: 'Gambar hero banner gagal diupload' })
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
        title: '',
        order: null,
        link: '',
        is_active: 'true',
        image: '',
        image_original_name: '',
        fileImage: null
      }
      this.isDragOver = false
      this.linkErrorMessage = ''
      this.dropFileErrorMessage = ''
    },
    onLinkInput (value) {
      const expUrl = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,})/gi
      const regexUrl = new RegExp(expUrl)
      if (!value.length || value.match(regexUrl)) {
        this.linkErrorMessage = ''
      } else {
        this.linkErrorMessage = 'Masukan url yang valid'
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
      this.form.fileImage = formData
    },
    onFileChange () {
      if (this.$refs.file.files[0]) {
        const isValidFormat = ['image/png', 'image/jpeg', 'image/svg+xml'].includes(this.$refs.file.files[0].type)
        if (isValidFormat) {
          if (this.$refs.file.files[0].size > 1000000) {
            this.form.fileImage = null
            this.dropFileErrorMessage = 'Gambar anda melebihi ukuran maksimal'
            this.isDragOver = false
          } else {
            this.dropFileErrorMessage = ''
            this.isDragOver = true
            this.setFile(this.$refs.file.files[0])
          }
        } else {
          this.form.fileImage = null
          this.dropFileErrorMessage = 'Maaf file yang anda masukan tidak didukung'
          this.isDragOver = false
        }
      } else {
        this.form.fileImage = null
        this.isDragOver = false
      }
    },
    dragOver () {
      this.isDragOver = true
    },
    dragLeave () {
      this.isDragOver = false
    },
    onFileDrop (e) {
      const isValidFormat = ['image/png', 'image/jpeg', 'image/svg+xml'].includes(e.dataTransfer.files[0].type)
      if (isValidFormat) {
        if (e.dataTransfer.files[0].size > 1000000) {
          this.form.fileImage = null
          this.dropFileErrorMessage = 'Gambar anda melebihi ukuran maksimal'
          this.isDragOver = false
        } else {
          this.isDragOver = true
          this.dropFileErrorMessage = ''
          this.setFile(e.dataTransfer.files[0])
        }
      } else {
        this.form.fileImage = null
        this.dropFileErrorMessage = 'Maaf file yang anda masukan tidak didukung'
        this.isDragOver = false
      }
    }
  }
}
</script>

<style lang="postcss">
@import './HeroBannerAdd.pcss';
</style>
