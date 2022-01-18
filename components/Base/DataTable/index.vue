<template>
  <div class="rounded-lg overflow-hidden border border-gray-100">
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
.jds-data-table__column-wrapper span {
  @apply text-left;
}

.jds-options__filter{
  @apply !w-full;
}

.jds-pagination__page-control__select__input .jds-input-text__input-wrapper {
  @apply !h-[36px];
}
</style>
