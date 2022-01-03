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
            fill="#B9C3D3"
            name="bell"
            size="20px"
          />
        </jds-badge>
      </button>
      <!-- User Dropdown -->
      <div
        class="header-dashboard__user"
      >
        <jds-popover :options="optionsPopover" :value="isUserDropdownOpen">
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
                  fill="#069550"
                  name="chevron-right"
                  size="16px"
                  class="header-dashboard__user-icon"
                  :class="isUserDropdownOpen ? 'rotate-90' : ''"
                />
              </button>
            </div>
          </template>
          <div class="header-dashboard__user-popover">
            <ul
              class="header-dashboard__user-list-action"
            >
              <div class="header-dashboard__user-list-action-logout" @click="logout">
                <div class="header-dashboard__user-list-action-logout-button">
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
export default {
  name: 'ComponentHeader',
  data () {
    return {
      notification: true,
      isUserDropdownOpen: false,
      pageName: 'Dashboard',
      optionsPopover: {
        strategy: 'fixed',
        placement: 'bottom-end',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 4]
            }
          }
        ]
      }
    }
  },
  methods: {
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

.notification__custom-badge .jds-badge__indicator {
  position: relative !important;
  left: -12px !important;
}
.notification__custom-badge .jds-badge__indicator span {
  color: white !important;
  font-weight: bold !important;
}

</style>
