<template>
  <div class="datatable">
    <JdsDataTable
      local-sort
      v-bind="$props"
      v-on="$listeners"
    >
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.action="{ item }">
        <slot name="item.action" :item="item" />
      </template>
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

<style lang="postcss">
@import './DataTable.pcss';
</style>
