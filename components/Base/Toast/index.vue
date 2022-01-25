<template>
  <transition
    enter-active-class="animate-slide-down"
    leave-active-class="animate-close-to-top"
  >
    <div
      v-if="isOpen"
      class="fixed z-1000 top-[88px] w-full flex justify-center min-h-[55px] pointer-events-none"
    >
      <JdsSectionMessage
        :show="isOpen"
        :variant="type"
        :message="message"
        dismissible
        class="w-fit min-w-[150px] shadow-lg pointer-events-auto"
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
