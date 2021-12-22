<template>
  <div>
    <div id="header" class="header">
      <div class="header__container wrapper">
        <img class="header__icon" src="~/assets/logo/logo-dedi.svg" alt="Logo Desa Digital" @click="$router.push('/')">
        <img class="header__icon-typo" src="~/assets/logo/logo-dedi-typo.svg" alt="Logo Desa Digital Typography" @click="$router.push('/')">
        <div class="header__action">
          <BaseButton variant="tertiary" type="button" label="Tentang Desa Digital" @click="$router.push('/about')" />
          <BaseButton variant="secondary" type="button" label="Beranda" @click="redirecToBeranda" />
        </div>
      </div>
    </div>
    <Nuxt />
  </div>
</template>

<script>
export default {
  methods: {
    redirecToBeranda () {
      window.location.replace(process.env.NUXT_ENV_URL_LANDING_PAGE)
    }
  }
}
</script>

<style lang="postcss">
.header{
  box-shadow: 0px 4px 16px rgba(36, 45, 39, 0.06);
  @apply fixed backdrop-filter backdrop-blur-[20px] bg-white bg-opacity-85 w-full z-10;

  &__container {
    @apply h-[60px] flex items-center justify-between;
  }

  &__action{
    @apply flex items-center gap-[16px] sm:gap-6;
  }

  &__icon-skeleton {
    @apply h-8 w-6 sm:w-40 bg-white rounded-md;
  }

  &__icon{
    @apply cursor-pointer w-6 h-8 sm:hidden;
  }

   &__icon-typo{
    @apply cursor-pointer h-8 hidden sm:block;
  }
}
</style>
