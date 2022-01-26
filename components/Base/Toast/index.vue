<template>
  <transition
    enter-active-class="animate-slide-down"
    leave-active-class="animate-close-to-top"
  >
    <div
      v-if="isOpen"
      class="toast"
    >
      <JdsSectionMessage
        :show="isOpen"
        :variant="type"
        :message="message"
        dismissible
        class="toast__section-message"
        @click:close="onClose"
      />
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'BaseToast',
  computed: {
    ...mapState('toast', ['isOpen', 'type', 'message'])
  },
  watch: {
    isOpen: {
      handler () {
        if (this.isOpen) {
          setTimeout(() => {
            this.onClose()
          }, 5000)
        }
      },
      immediate: true
    }
  },
  methods: {
    onClose () {
      this.$store.dispatch('toast/closeToast', null)
    }
  }
}
</script>

<style lang="postcss">
@import './Toast.pcss';
</style>
