<template>
  <header class="header-dashboard">
    <h1
      class="header-dashboard__title-page"
    >
      {{ pageName }}
    </h1>
    <div class="header-dashboard__left-action">
      <!-- Notification -->
      <button
        title="Notification"
      >
        <jds-badge
          :show="notification"
          class="notification__custom-badge"
          :value="8"
        >
          <jds-icon
            name="bell"
            size="20px"
          />
        </jds-badge>
      </button>
      <!-- User Dropdown -->
      <div
        class="header-dashboard__user"
      >
        <jds-popover ref="popover" v-clickaway="onClickAwayPopover" :options="optionsPopover" :value="isUserDropdownOpen">
          <template #activator>
            <div class="header-dashboard__user-activator">
              <!-- TODO: Replace dummy image with user avatar -->
              <img
                src="https://avatars.dicebear.com/api/micah/superadmin.svg"
                alt="user avatar"
                width="34"
                height="34"
                class="header-dashboard__user-avatar"
              >
              <button
                class="header-dashboard__user-box"
                @click="toggleUserDropdown"
              >
                <p
                  class="header-dashboard__user-title"
                >
                  Superadmin
                </p>
                <jds-icon
                  name="chevron-right"
                  size="16px"
                  :class="{
                    'header-dashboard__user-icon': true,
                    'header-dashboard__user-icon--rotate': isUserDropdownOpen
                  }"
                />
              </button>
            </div>
          </template>
          <div class="header-dashboard__user-popover">
            <ul
              class="header-dashboard__user-list-action"
            >
              <div
                class="header-dashboard__user-list-action-logout"
                @mouseover="menuActive = 'logout'"
                @mouseout="menuActive = null"
                @click="logout"
              >
                <div
                  :class="{
                    'header-dashboard__user-list-action-logout-button': true,
                    'header-dashboard__user-list-action-logout-button--hover': menuActive === 'logout'
                  }"
                >
                  <jds-icon
                    name="door-exit"
                    size="16px"
                  />
                  Keluar
                </div>
              </div>
            </ul>
          </div>
        </jds-popover>
      </div>
    </div>
  </header>
</template>

<script>
import { directive as clickaway } from 'vue-clickaway'
import optionsPopover from '@/constants/optionsPopover'
export default {
  name: 'ComponentHeader',
  directives: {
    clickaway
  },
  data () {
    return {
      notification: true,
      isUserDropdownOpen: false,
      optionsPopover,
      menuActive: null
    }
  },
  computed: {
    pageName () {
      return this.$store.state.pageName
    }
  },
  methods: {
    onClickAwayPopover () {
      this.isUserDropdownOpen = false
      this.$refs.popover.close()
    },
    logout () {
      this.$auth.logout()
    },
    toggleUserDropdown () {
      this.isUserDropdownOpen = !this.isUserDropdownOpen
    }
  }
}
</script>

<style lang="postcss">
@import './Header.pcss';
</style>
