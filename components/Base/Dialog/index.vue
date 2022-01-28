<template>
  <transition name="fade">
    <div v-if="open" class="dialog">
      <div class="dialog__card">
        <div class="dialog__header">
          {{ header }}
        </div>
        <div class="dialog__content">
          <div class="dialog__title">
            {{ title }}
          </div>
          <div class="dialog__message">
            {{ message }}
          </div>
        </div>
        <div class="dialog__action">
          <BaseButton label="Batal" :variant="btnLeftVariant" @click="onClose" />
          <BaseButton
            label="Ya, saya yakin"
            :variant="btnRightVariant"
            @click="actionBtnRight"
          />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'BaseDialog',
  computed: {
    ...mapGetters('dialog', ['open', 'header', 'message', 'title', 'btnLeftVariant', 'btnRightVariant', 'actionBtnRight'])
  },
  methods: {
    onClose () {
      this.$store.dispatch('dialog/closeDialog')
    }
  }
}
</script>

<style lang="postcss">
@import './Dialog.pcss';
</style>
