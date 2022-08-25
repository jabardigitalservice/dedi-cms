<template>
  <transition name="fade">
    <div v-if="show" class="dialog">
      <div class="dialog__card">
        <div class="dialog__header">
          {{ header }}
        </div>
        <div class="dialog__content">
          <div class="dialog__text">
            {{ title }}
          </div>
          <div class="dialog__data">
            <div>
              {{ data }}
            </div>
          </div>
        </div>
        <slot />
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'MitraDialog',
  props: {
    /**
     * make modal visible or not
     */
    show: {
      type: Boolean,
      default: false
    },
    header: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    data: {
      type: String,
      default: ''
    }
  },
  methods: {
  }
}
</script>

<style lang="postcss">
@import './DialogMitra.pcss';
</style>
