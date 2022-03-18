export const state = () => ({
  pageName: 'Dashboard',
  subMenu: null,
  isSameRoutePage: false
})

export const mutations = {
  setPageName (state, pageName) {
    if (state.pageName === pageName) {
      this.commit('setTrackPage', true)
    } else {
      this.commit('setTrackPage', false)
    }
    state.pageName = pageName
  },

  setSubMenu (state, subMenu) {
    state.subMenu = subMenu
  },

  setTrackPage (state, value) {
    state.isSameRoutePage = value
  }
}
