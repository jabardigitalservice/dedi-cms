<template>
  <div class="rounded-lg overflow-hidden border border-gray-100">
    <JdsDataTable
      local-sort
      v-bind="$props"
    >
      <slot name="action">
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item[action]="{item}">
          <AgendaTableAction :item="item" />
        </template>
      </slot>
    </JdsDataTable>
  </div>
</template>

<script>
export default {
  name: 'BaseDataTable',
  props: {
    headers: {
      type: Array,
      require: true,
      default: () => []
    },
    items: {
      type: Array,
      require: false,
      default: () => []
    },
    loading: {
      type: Boolean,
      require: false,
      default: false
    },
    pagination: {
      type: Object,
      require: false,
      default: () => {}
    }
  },
  data () {
    return {

    }
  }
}
</script>

<style>

</style>
