<template>
  <transition name="fade">
    <div v-if="open" class="dialog">
      <div class="dialog__card">
        <div class="dialog__header">
          {{ header }}
        </div>
        <div class="dialog__content">
          <div
            :class="{
              'dialog__title' : true,
              'dialog__title--center' : dialogType === 'process',
            }"
          >
            <span v-if="iconMessage" class="mr-3">
              <jds-icon :class="iconColor" size="14px" :name="iconMessage" />
            </span>
            {{ title }}
          </div>
          <div class="dialog__message">
            <div :class="iconMessage ? 'ml-7' : null">
              {{ message }}
            </div>
          </div>
        </div>
        <div
          :class="{
            'dialog__action' : true,
            'dialog__action--center' : dialogType !== 'confirmation',
          }"
        >
          <BaseButton
            v-if="dialogType === 'confirmation'"
            :label="btnLeftLabel"
            :variant="btnLeftVariant"
            @click="onClose"
          />
          <BaseButton
            v-if="dialogType === 'confirmation' || dialogType === 'information'"
            :label="btnRightLabel"
            :variant="btnRightVariant"
            @click="actionBtnRight"
          />
          <div v-if="dialogType == 'process'">
            <progress
              max="100"
              :value="progressValue"
            />
          </div>
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
    ...mapGetters('dialog', [
      'open',
      'header',
      'message',
      'iconMessage',
      'iconColor',
      'title',
      'btnLeftVariant',
      'btnRightVariant',
      'btnLeftLabel',
      'btnRightLabel',
      'actionBtnRight',
      'dialogType',
      'progressValue'
    ])
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
