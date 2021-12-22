<template>
  <jds-button
    :class="{
      'jds-button--circle' : variant === 'circle',
      'jds-button--disabled' : variant === 'disabled',
    }"
    v-bind="{...props,...$attrs}"
    v-on="$listeners"
  >
    <div class="jds-button__icon">
      <slot name="icon" />
      <slot />
    </div>
    <div v-if="loading" class="jds-button__loading">
      <span>
        {{ textLoading }}
      </span>
      <jds-spinner size="20px" />
    </div>
  </jds-button>
</template>

<script>
export default {
  name: 'BaseButton',
  inheritAttrs: false,
  props: {
    /**
     * Variant styles button
     */
    variant: {
      type: String,
      default: 'primary'
    },
    /**
     * Text inside button
     */
    label: {
      type: String,
      default: ''
    },
    /**
     * Type of button like button or submit
     */
    type: {
      type: String,
      default: 'button'
    },
    /**
     * Show the button show loading spinner
     */
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * Text when button is loading
     */
    textLoading: {
      type: String,
      default: ''
    }
  },
  computed: {
    /**
     * Handle when button loading label cannot include and replacing to text loading
     */
    props () {
      if (this.loading) {
        const props = this.$props
        delete props.label
        return props
      }
      return this.$props
    }
  }
}
</script>

<style lang="postcss" scoped>
@import './Button.pcss';
</style>
