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
      default: () => []
    },
    items: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    pagination: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style lang="postcss">
@import './DataTable.pcss';
</style>
