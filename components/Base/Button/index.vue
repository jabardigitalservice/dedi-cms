<template>
  <jds-button
    :class="[renderClasses]"
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
    },
    /**
     * Size of buttton
     */
    size: {
      type: String,
      default: 'base'
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
    },
    renderClasses () {
      return `jds-button--${this.variant}-${this.size === 'base' ? '' : this.size}`
    }
  }
}
</script>

<style lang="postcss" scoped>
@import './Button.pcss';
</style>
