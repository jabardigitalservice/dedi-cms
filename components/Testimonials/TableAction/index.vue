<template>
  <JdsPopover
    class="datatable__action-button"
    :value="isDropdownOpen"
    :options="popoverOptions"
  >
    <template #activator>
      <BaseButton
        v-on-clickaway="closeDropdown"
        variant="secondary"
        size="small"
        @click="toggleDropdown"
      >
        Aksi
        <JdsIcon
          name="chevron-down"
          size="14px"
          fill="#069550"
          class="action__icon"
          :class="isDropdownOpen ? '-rotate-180' : null"
        />
      </BaseButton>
    </template>

    <div class="action__dropdown">
      <ul class="action__dropdown-list">
        <li>
          <button class="action__dropdown-item" @click="$emit('detail')">
            Detail
          </button>
        </li>
        <li>
          <button class="action__dropdown-item" @click="$emit('edit')">
            Ubah
          </button>
        </li>
        <li>
          <button class="action__dropdown-item" @click="$emit('delete')">
            Hapus
          </button>
        </li>
      </ul>
    </div>
  </JdsPopover>
</template>

<script>
import { directive as onClickaway } from 'vue-clickaway'

export default {
  name: 'TestimonialsTableAction',
  directives: {
    onClickaway
  },
  data () {
    return {
      isDropdownOpen: false,
      popoverOptions: {
        modifiers: [
          {
            name: 'offset',
            options: { offset: [0, 8] }
          }
        ]
      }
    }
  },
  methods: {
    toggleDropdown () {
      this.isDropdownOpen = !this.isDropdownOpen
    },
    closeDropdown () {
      this.isDropdownOpen = false
    }
  }
}
</script>

<style lang="postcss">
@import './TestimonialsTableAction.pcss';
</style>
