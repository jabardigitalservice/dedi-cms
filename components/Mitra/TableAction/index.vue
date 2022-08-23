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
          <button v-if="status === 'Menunggu Verifikasi'" class="action__dropdown-item" @click="$emit('verify')">
            Verifikasi Akun
          </button>
          <button v-if="status === 'Nonaktif'" class="action__dropdown-item" @click="$emit('activate')">
            Aktif
          </button>
          <button v-if="status === 'Aktif'" class="action__dropdown-item" @click="$emit('deactivate')">
            Non Aktif
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
  name: 'MitraTableAction',
  directives: {
    onClickaway
  },
  props: {
    status: {
      type: String,
      default: ''
    }
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
.datatable__action-button .jds-popover__content {
  z-index: 20 !important;
}

.action {
  &__icon{
    @apply ml-[10px] transition-all ease-in duration-200;
  }

  &__dropdown {
    @apply bg-white p-[18px] rounded-lg border border-gray-200 shadow-xl;

    &-list {
      @apply flex flex-col gap-4;
    }

    &-item {
      @apply text-sm leading-4 text-gray-800;
    }
  }
}
</style>
