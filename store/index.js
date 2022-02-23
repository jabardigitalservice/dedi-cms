export const state = () => ({
  pageName: 'Dashboard',
  subMenu: null
})

export const mutations = {
  setPageName (state, pageName) {
    state.pageName = pageName
  },

  setSubMenu (state, subMenu) {
    state.subMenu = subMenu
  }
}
