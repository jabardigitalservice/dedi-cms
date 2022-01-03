export const state = () => ({
  pageName: 'Dashboard'
})

export const mutations = {
  setPageName (state, pageName) {
    state.pageName = pageName
  }
}
