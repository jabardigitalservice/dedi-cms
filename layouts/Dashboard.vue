<template>
  <div class="dashboard">
    <Sidebar class="dashboard__sidebar" />
    <div class="dashboard__header">
      <Header />
      <div class="dashboard__content">
        <Nuxt />
      </div>
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
  @apply bg-no-repeat bg-bottom h-screen w-screen bg-[#EDEFF3]
  w-full h-screen grid grid-cols-[minmax(260px,15%),1fr];

  &__sidebar {
    @apply bg-white h-screen;
  }

  &__header {
    @apply w-full overflow-y-auto;
  }

  &__content {
    @apply w-full h-[calc(100%-72px)] px-6 py-[26px];
  }
}
</style>
