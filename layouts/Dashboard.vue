<template>
  <div class="dashboard">
    <BaseToast />
    <Sidebar class="dashboard__sidebar" />
    <Header class="dashboard__header" />
    <div class="dashboard__content">
      <Nuxt />
    </div>
  </div>
</template>

<script>
export default {
  name: 'LayoutDashboard'
}
</script>

<style lang="postcss">
.dashboard {
  background-image: url('~assets/images/background-login.svg');
  @apply bg-no-repeat bg-bottom bg-[#EDEFF3] bg-fixed;

  &__sidebar {
    @apply bg-white w-min-[260px] fixed left-0 top-0 h-screen;
  }

  &__header {
    @apply ml-[260px] w-[calc(100%-260px)] sticky top-0;
  }

  &__content {
    @apply ml-[260px] px-6 py-[26px] h-max;
  }
}
</style>
