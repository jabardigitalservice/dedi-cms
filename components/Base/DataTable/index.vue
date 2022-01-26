<template>
  <div class="datatable">
    <JdsDataTable
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
    /**
     * List header datatable
     */
    headers: {
      type: Array,
      default: () => []
    },
    /**
     * List item content datatable
     */
    items: {
      type: Array,
      default: () => []
    },
    /**
     * show loading when data changes
     */
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * Data Object pagination
     */
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
