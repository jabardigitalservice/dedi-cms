<template>
  <div class="login">
    <div class="login__form">
      <img class="login__form-background-side" height="558" width="285" src="~/assets/images/background-side-login.svg" alt="Background Side Login">
      <div class="login__form-logo">
        <img width="128" height="32" src="~/assets/logo/logo-dedi-typo-small.svg" alt="Logo Dedi Typography">
        <img width="205" height="40" src="~/assets/logo/logo-text-cms.svg" alt="Logo text CMS">
      </div>
      <form class="login__form-login" method="post" @submit.prevent="login">
        <div class="login__form-login-title">
          Masuk ke Akun Anda
        </div>
        <div v-if="error">
          <jds-section-message
            class="login__form-login-error-message"
            show
            variant="error"
            dismissible
            :message="errorMessage"
            @click:close="error = false"
          />
        </div>
        <BaseInputText
          v-model="email"
          name="email"
          autocomplete="login email"
          autofocus
          label="E-mail"
          label-italic
          placeholder="Contoh: agus.permadi@gmail.com"
          type="text"
          icon-left-type="border"
          :error="error"
        >
          <template #icon-left>
            <img width="16" height="16" src="~/assets/icons/email.svg" alt="icon email">
          </template>
        </BaseInputText>
        <div class="login__form-login-password">
          <BaseInputText
            v-model="password"
            name="password"
            autocomplete="login password"
            label="Kata Sandi"
            placeholder="Masukkan kata sandi"
            type="password"
            icon-left-type="border"
          >
            <template #icon-left>
              <img width="16" height="16" src="~/assets/icons/key.svg" alt="icon key">
            </template>
          </BaseInputText>
          <div class="flex justify-end items-center">
            <nuxt-link to="/forgot-password" class="login__form-login-forgot-password">
              Lupa Kata Sandi ?
            </nuxt-link>
          </div>
        </div>
        <BaseButton
          class="login__form-login-button-submit"
          type="submit"
          label="Masuk"
          text-loading="Sedang memeriksa akun"
          :disabled="disableButton"
          :variant="buttonVariant"
          :loading="loading"
        />
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageLogin',
  layout: 'HeaderLogin',
  data () {
    return {
      email: '',
      password: '',
      loading: false,
      error: false,
      errorMessage: '',
      totalFailedLogin: 0
    }
  },
  computed: {
    disableButton () {
      return (!this.email.length && !this.password.length) || this.loading
    },
    buttonVariant () {
      if (this.email.length && this.password.length && !this.loading) {
        return 'primary'
      }
      return 'disabled'
    }
  },
  watch: {
    email (val) {
      this.error = false
    },
    password (val) {
      this.error = false
    }
  },
  methods: {
    async login () {
      if (window.PasswordCredential) {
        // this PasswordCredential is an expremential technology cannot support all browser
        // eslint-disable-next-line no-undef
        const credential = new PasswordCredential({
          id: this.email,
          password: this.password
        })
        navigator.credentials.store(credential)
      }

      this.loading = true

      try {
        await this.$auth.loginWith('local', { data: { email: this.email, password: this.password } })
      } catch (err) {
        if (err.response?.status === 429) {
          this.$router.push('/forgot-password')
        }
        if (err.response?.status === 422) {
          const errors = err.response.data?.errors
          this.errorMessage = errors[Object.keys(errors)[0]] // get first property from errors object
          this.error = !!this.errorMessage // if error message undefined section message cannot show error
        }
        if (err.response?.status === 401) {
          this.error = true
          this.errorMessage = err.response.data?.error
        }
        if (!err.response) {
          this.error = true
          this.errorMessage = 'Mohon maaf server sedang dalam gangguan'
        }
      }
      this.loading = false
    }
  }
}
</script>

<style lang="postcss" scoped>
@import './Login.pcss';
</style>
