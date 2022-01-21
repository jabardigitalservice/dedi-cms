<template>
  <div class="subheader">
    <h1 class="subheader__title">
      {{ title }}
    </h1>
    <p v-if="descriptions" class="subheader__descriptions">
      {{ descriptions }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'ComponentSubHeader',
  props: {
    title: {
      type: String,
      default: ''
    },
    descriptions: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="postcss">
@import './SubHeader.pcss';
</style>
