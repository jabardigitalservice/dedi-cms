<template>
  <transition name="fade">
    <div v-if="show" class="modal">
      <div class="modal__wrapper">
        <h6 class="modal__title">
          {{ title }}
        </h6>
        <div class="modal__content">
          <slot />
        </div>
        <div class="modal__action">
          <BaseButton label="Batal" variant="secondary" @click="onClose" />
          <BaseButton
            :label="labelRightBtn"
            text-loading="Sedang mengirim"
            :loading="loading"
            :variant="variantAddButton"
            :disabled="!isFormCompleted || loading"
            @click="onSubmit"
          />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'BaseModal',
  props: {
    /**
     * make modal visible or not
     */
    show: {
      type: Boolean,
      default: false
    },
    /**
     * title modal
     */
    title: {
      type: String,
      default: ''
    },
    /**
     * all field of form is completed
     */
    isFormCompleted: {
      type: Boolean,
      default: false
    },
    /**
     * loading button
     */
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * text of button right
     */
    labelRightBtn: {
      type: String,
      default: ''
    }
  },
  computed: {
    variantAddButton () {
      return !this.isFormCompleted || this.loading ? 'disabled' : 'primary'
    }
  },
  methods: {
    onClose () {
      this.$emit('close')
    },
    onSubmit () {
      this.$emit('submit')
    }
  }
}
</script>

<style lang="postcss">
@import './Modal.pcss';
</style>
