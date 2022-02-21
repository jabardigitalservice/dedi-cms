<template>
  <BaseModal
    :show="mShow"
    :loading="loading"
    :is-form-completed="isFormCompleted"
    label-right-btn="Tambah"
    title="Tambah - Testimoni"
    @submit="onSubmit"
    @close="onModalClose"
  >
    <form v-if="mShow" class="form-add-testimonial" @submit.prevent>
      <div class="form-add-testimonial__box-avatar">
        <div>
          <div class="form-add-testimonial__box-avatar-avatar">
            <img v-if="imagePath.length" class="form-add-testimonial__box-avatar-image" :src="imagePath" :alt="form.image">
            <jds-icon
              v-else
              fill="#BDBDBD"
              size="20px"
              name="user"
            />
          </div>
        </div>
        <div>
          <div class="form-add-testimonial__box-avatar-title">
            Upload Foto Profile
          </div>
          <div>Ukuran maksimal file adalah 1 Mb.</div>
          <div>File yang didukung adalah .jpg dan .png</div>
          <div class="form-add-testimonial__box-avatar-button">
            <BaseButton @click="$refs.avatar.click()">
              <template #icon>
                <div class="testimonial__datatable-header-add">
                  Tambah File
                  <div class="testimonial__datatable-header-plus-icon">
                    <jds-icon size="14px" name="plus-bold" />
                  </div>
                </div>
              </template>
            </BaseButton>
          </div>
          <div v-if="fileErrorMessage" class="form-add-testimonial__box-avatar-error-message">
            {{ fileErrorMessage }}
          </div>
          <div v-else-if="!imagePath.length">
            Belum ada file terpilih.
          </div>
        </div>
        <input
          ref="avatar"
          name="avatar"
          type="file"
          accept="image/png, image/jpeg, image/svg+xml"
          hidden="true"
          @change="onFileChange"
        >
      </div>
      <div class="form-add-testimonial__form-group">
        <jds-radio-button-group
          v-model="form.role"
          name="role"
          orientation="horizontal"
          :items="optionsRole"
          label="Role Pengguna"
        />
      </div>
      <div class="form-add-testimonial__form-group">
        <jds-input-text
          v-model="form.name"
          name="name"
          label="Nama Pengguna"
          placeholder="Masukan nama anda"
        />
      </div>
      <div v-if="form.role === 'masyarakat'" class="form-add-testimonial__form-group">
        <jds-select
          v-model="form.desa"
          name="desa"
          options-header="Desa"
          filterable
          :options="optionsDesa"
          label="Domisili Desa"
          placeholder="Pilih Desa"
        />
      </div>
      <div v-else class="form-add-testimonial__form-group">
        <jds-select
          v-model="form.mitra"
          name="mitra"
          options-header="Mitra"
          filterable
          :options="optionsMitra"
          label="Mitra"
          placeholder="Pilih Mitra"
        />
      </div>
      <div class="form-add-testimonial__form-group">
        <jds-text-area
          v-model="form.testimonial"
          name="name"
          label="Testimonial"
          placeholder="Masukan testimonial anda"
          class="w-full"
          :error-message="testimonialErrorMessage"
        />
        <span v-if="!testimonialErrorMessage.length" class="form-add-testimonial__form-group-desc">Tersisa {{ 155 - form.testimonial.length }} Karakter</span>
      </div>
      <div class="form-add-testimonial__form-group">
        <jds-radio-button-group
          v-model="form.is_active"
          name="status"
          orientation="horizontal"
          :items="optionsTestimonial"
          label="Status Testimoni"
        />
      </div>
    </form>
  </BaseModal>
</template>

<script>
export default {
  name: 'ComponentTestimoanialsAdd',
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
      loading: false,
      form: {
        name: '',
        role: 'masyarakat',
        mitra: null,
        desa: null,
        testimonial: '',
        fileImage: null,
        is_active: 'true',
        image: '',
        image_original_name: ''
      },
      imagePath: '',
      fileErrorMessage: '',
      testimonialErrorMessage: '',
      listDesa: [],
      listMitra: [],
      optionsRole: [
        {
          value: 'masyarakat',
          placeholder: 'Masyarakat'
        },
        {
          value: 'mitra',
          placeholder: 'Mitra'
        }
      ],
      optionsTestimonial: [
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
    optionsDesa () {
      let desa = []
      if (Array.isArray(this.listDesa) && this.listDesa.length) {
        desa = this.listDesa.map((item) => {
          return {
            value: item.id,
            label: item.name
          }
        })
      }
      return desa
    },
    optionsMitra () {
      let optionsMitra = []
      if (Array.isArray(this.listMitra) && this.listMitra.length) {
        optionsMitra = this.listMitra.map((item) => {
          return {
            value: item.id,
            label: item.name
          }
        })
      }
      return optionsMitra
    },
    optionsOrderBanner () {
      const options = []
      for (let i = 1; i <= 5; i++) {
        options.push(i)
      }
      return options
    },
    isFormCompleted () {
      return !!((
        this.form.role.length &&
        this.form.name.length &&
        this.form.is_active &&
        this.form.fileImage &&
        this.form.testimonial.length &&
        !this.fileErrorMessage.length &&
        !this.testimonialErrorMessage.length
      ) && (this.form.desa || this.form.mitra))
    }
  },
  watch: {
    show: {
      handler (val) {
        this.mShow = val
      },
      immediate: true
    },
    'form.testimonial' (value) {
      if (value.length > 155) {
        this.testimonialErrorMessage = 'Testimonial melebihi maksimal 155 karakter'
      } else {
        this.testimonialErrorMessage = ''
      }
    }
  },
  mounted () {
    this.fetchDesa()
    this.fetchMitra()
  },
  methods: {
    async fetchDesa () {
      try {
        // this query is temporary and will be replace in the future
        const response = await this.$axios.get('/villages/suggestion')
        this.listDesa = response.data.data || []
      } catch {
        this.listDesa = []
      }
    },
    async fetchMitra () {
      try {
        const response = await this.$axios.get('/partners/suggestion')
        this.listMitra = response.data.data || []
      } catch {
        this.listMitra = []
      }
    },
    onSubmit () {
      this.loading = true
      this.submitFile(this.form.fileImage)
        .then((response) => {
          this.form.avatar = response.source
          this.form.avatar_original_name = response.original_name
          this.form.description = this.form.testimonial
          this.form.type = this.form.role
          this.form.village_id = this.form.desa
          this.form.partner_id = this.form.mitra
        })
        .then(async () => {
          try {
            await this.$axios.post('/testimonials', this.form)
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
        name: '',
        role: 'masyarakat',
        mitra: null,
        desa: null,
        testimonial: '',
        is_active: 'true',
        fileImage: null,
        image: '',
        image_original_name: ''
      }
      this.imagePath = ''
      this.testimonialErrorMessage = ''
      this.fileErrorMessage = ''
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
      this.imagePath = URL.createObjectURL(value)
    },
    onFileChange () {
      if (this.$refs.avatar.files[0]) {
        const isValidFormat = ['image/png', 'image/jpeg', 'image/svg+xml'].includes(this.$refs.avatar.files[0].type)
        if (isValidFormat) {
          if (this.$refs.avatar.files[0].size > 1000000) {
            this.form.fileImage = null
            this.imagePath = ''
            this.fileErrorMessage = 'Gambar anda melebihi ukuran maksimal'
          } else {
            this.fileErrorMessage = ''
            this.setFile(this.$refs.avatar.files[0])
          }
        } else {
          this.form.fileImage = null
          this.imagePath = ''
          this.fileErrorMessage = 'Maaf file yang anda masukan tidak didukung'
        }
      } else {
        this.imagePath = ''
        this.form.fileImage = null
      }
    }
  }
}
</script>

<style lang="postcss">
@import './TestimonialsAdd.pcss';
</style>
