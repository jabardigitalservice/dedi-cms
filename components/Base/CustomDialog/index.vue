<template>
  <transition name="fade">
    <div v-if="show" class="custom-dialog">
      <div class="custom-dialog__card">
        <div class="custom-dialog__header">
          {{ header }}
        </div>
        <div class="custom-dialog__content">
          <div class="custom-dialog__text">
            {{ title }}
          </div>
          <div class="custom-dialog__data">
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
  name: 'CustomDialog',
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
@import './CustomDialog.pcss';
</style>
