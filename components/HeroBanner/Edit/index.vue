<template>
  <BaseModal
    :show="mShow"
    :loading="loading"
    :is-form-completed="isFormCompleted"
    label-right-btn="Simpan Perubahan"
    title="Ubah Data - Hero Banner"
    @submit="onSubmit"
    @close="onModalClose"
  >
    <form v-if="mShow" class="form-edit-hero-banner">
      <h2 class="form-edit-hero-banner__title">
        Hero Banner
      </h2>
      <input
        ref="file"
        name="file"
        type="file"
        accept="image/png, image/jpeg, image/svg+xml"
        hidden="true"
        @change="onFileChange"
      >
      <img v-if="infoImage.path" class="form-edit-hero-banner__image" :src="infoImage.path" :alt="form.title">
      <div v-else class="form-edit-hero-banner__image form-edit-hero-banner__image-placeholder" />
      <div class="form-edit-hero-banner__form-group">
        <jds-input-text
          v-model="infoImage.image_original_name"
          name="judul"
          placeholder="Masukan judul"
          :error-message="imageErrorMessage"
        >
          <template #suffix-icon>
            <div class="form-edit-hero-banner__path" @click="$refs.file.click()">
              <div class="form-edit-hero-banner__path-icon">
                <jds-icon
                  name="pencil"
                  size="1rem"
                  fill="#069550"
                />
              </div>
              <span class="form-edit-hero-banner__path-text">Ganti Hero Banner</span>
            </div>
          </template>
        </jds-input-text>
      </div>
      <div class="form-edit-hero-banner__form-group">
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
      <div class="form-edit-hero-banner__form-group">
        <jds-input-text
          v-model="form.title"
          name="judul"
          label="Judul Hero Banner"
          placeholder="Masukan judul"
        />
      </div>
      <div class="form-edit-hero-banner__form-group">
        <jds-input-text
          v-model="form.link"
          name="link"
          label="Link"
          :error-message="linkErrorMessage"
          placeholder="Masukan link"
          @input="onLinkInput"
        />
      </div>
      <div class="form-edit-hero-banner__form-group">
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
  name: 'ComponentHeroBannerEdit',
  props: {
    /**
     * make modal visible or not
     */
    show: {
      type: Boolean,
      default: false
    },
    /**
     * object of hero banner
     */
    item: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      loading: false,
      mShow: undefined,
      linkErrorMessage: '',
      imageErrorMessage: '',
      fileImage: null,
      infoImage: {
        path: '',
        image: '',
        image_original_name: ''
      },
      form: {
        id: null,
        title: '',
        order: null,
        link: '',
        is_active: 'true'
      },
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
        this.form.id &&
        this.form.title.length &&
        this.form.link.length &&
        this.form.order &&
        this.form.is_active &&
        !this.linkErrorMessage.length &&
        !this.imageErrorMessage.length &&
        (this.fileImage || this.infoImage.image)
      ))
    }
  },
  watch: {
    show: {
      handler (val) {
        this.mShow = val
        const isActive = this.item.is_active ?? ''
        this.form = { ...this.item, is_active: isActive.toString() }
        this.infoImage = {
          path: this.item.image?.path,
          image: this.item.image?.source,
          image_original_name: this.item.image?.original_name
        }
        this.linkErrorMessage = ''
        this.imageErrorMessage = ''
        this.fileImage = null
      },
      immediate: true
    }
  },
  methods: {
    async onSubmit () {
      this.loading = true
      const form = { ...this.form, ...this.infoImage }
      if (this.fileImage) {
        this.submitFile(this.fileImage)
          .then((response) => {
            form.image = response.source
            form.image_original_name = response.original_name
          })
          .then(async () => {
            try {
              await this.$axios.put(`/pages/${form.id}`, form)
              this.$emit('close')
              this.$store.dispatch('toast/showToast', { type: 'success', message: 'Data berhasil diubah' })
              this.$emit('stored')
            } catch (error) {
              this.$store.dispatch('toast/showToast', { type: 'error', message: 'Data gagal diubah, periksa kembali data yang dinputkan' })
            }
          })
          .catch(() => {
            this.$store.dispatch('toast/showToast', { type: 'error', message: 'Gambar hero banner gagal diupload' })
          }).finally(() => {
            this.loading = false
          })
      } else {
        try {
          await this.$axios.put(`/pages/${form.id}`, form)
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
    onModalClose () {
      this.$emit('close')
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
    setFile (value) {
      const formData = new FormData()
      formData.append('file', value)
      this.fileImage = formData
    },
    onFileChange () {
      if (this.$refs.file.files[0]) {
        const isValidFormat = ['image/png', 'image/jpeg', 'image/svg+xml'].includes(this.$refs.file.files[0].type)
        if (isValidFormat) {
          if (this.$refs.file.files[0].size > 1000000) {
            this.fileImage = null
            this.imageErrorMessage = 'Gambar anda melebihi ukuran maksimal'
          } else {
            this.imageErrorMessage = ''
            this.setFile(this.$refs.file.files[0])
          }
          this.infoImage.image_original_name = this.$refs.file.files[0].name
          this.infoImage.path = URL.createObjectURL(this.$refs.file.files[0])
        } else {
          this.fileImage = null
          this.imageErrorMessage = 'Maaf file yang anda masukan tidak didukung'
        }
      } else {
        this.fileImage = null
        this.infoImage.path = null
        this.infoImage.image_original_name = ''
        this.imageErrorMessage = 'Belum ada file terpilih'
      }
    }
  }
}
</script>

<style lang="postcss">
@import './HeroBannerEdit.pcss';
</style>
