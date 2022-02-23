<template>
  <BaseModal
    :show="mShow"
    :loading="loading"
    :is-form-completed="isFormCompleted"
    label-right-btn="Simpan Perubahan"
    title="Ubah Data - Testimoni"
    @submit="onSubmit"
    @close="onModalClose"
  >
    <form v-if="mShow" class="form-edit-testimonial" @submit.prevent>
      <div class="form-edit-testimonial__box-avatar">
        <div>
          <div class="form-edit-testimonial__box-avatar-avatar">
            <img v-if="imagePath.length" class="form-edit-testimonial__box-avatar-image" :src="imagePath" :alt="form.image">
            <jds-icon
              v-else
              fill="#BDBDBD"
              size="20px"
              name="user"
            />
          </div>
        </div>
        <div>
          <div class="form-edit-testimonial__box-avatar-title">
            Upload Foto Profile
          </div>
          <div>Ukuran maksimal file adalah 1 Mb.</div>
          <div>File yang didukung adalah .jpg dan .png</div>
          <div class="form-edit-testimonial__box-avatar-button">
            <BaseButton @click="$refs.avatar.click()">
              <template #icon>
                <div class="testimonial__datatable-header-add">
                  Ubah File
                  <div class="testimonial__datatable-header-plus-icon">
                    <jds-icon size="14px" name="pencil" />
                  </div>
                </div>
              </template>
            </BaseButton>
          </div>
          <div v-if="fileErrorMessage" class="form-edit-testimonial__box-avatar-error-message">
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
      <div class="form-edit-testimonial__form-group">
        <jds-radio-button-group
          v-model="form.type"
          name="role"
          orientation="horizontal"
          :items="optionsRole"
          label="Role Pengguna"
        />
      </div>
      <div class="form-edit-testimonial__form-group">
        <jds-input-text
          v-model="form.name"
          name="name"
          label="Nama Pengguna"
          placeholder="Masukan nama anda"
        />
      </div>
      <div v-if="form.type === 'masyarakat'" class="form-edit-testimonial__form-group">
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
      <div v-else class="form-edit-testimonial__form-group">
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
      <div class="form-edit-testimonial__form-group">
        <jds-text-area
          v-model="form.testimonial"
          name="name"
          label="Testimonial"
          placeholder="Masukan testimonial anda"
          class="w-full"
          :error-message="testimonialErrorMessage"
        />
        <span v-if="!testimonialErrorMessage.length" class="form-edit-testimonial__form-group-desc">Tersisa {{ 155 - form.testimonial.length }} Karakter</span>
      </div>
      <div class="form-edit-testimonial__form-group">
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
  name: 'ComponentTestimoanialsEdit',
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
      mShow: undefined,
      loading: false,
      form: {
        name: '',
        type: 'masyarakat',
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
    isFormCompleted () {
      return !!((
        this.form.type.length &&
        this.form.name.length &&
        this.form.is_active &&
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
        if (Object.keys(this.item).length) {
          const isActive = this.item.is_active ? 'true' : 'false'
          this.form = {
            ...this.form,
            ...this.item,
            desa: this.item.village?.id,
            mitra: this.item.partner?.id,
            is_active: isActive.toString()
          }
          this.fileErrorMessage = ''
          this.testimonialErrorMessage = ''
          this.imagePath = this.item.avatar?.path
        }
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
    async onSubmit () {
      this.loading = true
      if (this.form.fileImage) {
        this.submitFile(this.form.fileImage)
          .then((response) => {
            this.form.avatar_original_name = response.original_name
            this.form.avatar = response.source
            this.form.description = this.form.testimonial
            this.form.village_id = this.form.desa
            this.form.partner_id = this.form.mitra
          })
          .then(async () => {
            try {
              await this.$axios.put(`/testimonials/${this.form.id}`, this.form)
              this.$emit('close')
              this.$store.dispatch('toast/showToast', { type: 'success', message: 'Data berhasil disimpan' })
              this.$emit('stored')
            } catch (error) {
              this.$store.dispatch('toast/showToast', { type: 'error', message: 'Data gagal disimpan, periksa kembali data yang dinputkan' })
            }
          })
          .catch(() => {
            this.$store.dispatch('toast/showToast', { type: 'error', message: 'Gambar testimonial testimonial gagal diupload' })
          }).finally(() => {
            this.loading = false
          })
      } else {
        try {
          this.form.avatar_original_name = this.form.avatar.original_name
          this.form.avatar = this.form.avatar.source
          this.form.description = this.form.testimonial
          this.form.village_id = this.form.desa
          this.form.partner_id = this.form.mitra
          await this.$axios.put(`/testimonials/${this.form.id}`, this.form)
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
    onModalClose () {
      this.$emit('close')
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
@import './TestimoanialsEdit.pcss';
</style>
