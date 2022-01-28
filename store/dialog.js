export const state = () => ({
  isOpen: false,
  header: '',
  title: '',
  message: '',
  btnLeftVariant: 'secondary',
  btnRightVariant: 'primary',
  actionBtnRight: () => {}
})

export const mutations = {
  SET_OPEN (state, payload) {
    state.isOpen = payload
  },
  SET_MESSAGE (state, payload) {
    state.message = payload
  },
  SET_HEADER (state, payload) {
    state.header = payload
  },
  SET_TITLE (state, payload) {
    state.title = payload
  },
  SET_BUTTON_LEFT_VARIANT (state, payload) {
    state.btnLeftVariant = payload
  },
  SET_BUTTON_RIGHT_VARIANT (state, payload) {
    state.btnRightVariant = payload
  },
  SET_ACTION_BTN_RIGHT (state, payload) {
    state.actionBtnRight = payload
  }
}

export const getters = {
  open (state) {
    return state.isOpen
  },
  message (state) {
    return state.message
  },
  title (state) {
    return state.title
  },
  header (state) {
    return state.header
  },
  btnLeftVariant (state) {
    return state.btnLeftVariant
  },
  btnRightVariant (state) {
    return state.btnRightVariant
  },
  actionBtnRight (state) {
    return state.actionBtnRight
  }
}

export const actions = {
  showDialog ({ commit }, payload) {
    commit('SET_HEADER', payload.header)
    commit('SET_TITLE', payload.title)
    commit('SET_MESSAGE', payload.message)
    commit('SET_BUTTON_LEFT_VARIANT', payload.btnLeftVariant)
    commit('SET_BUTTON_RIGHT_VARIANT', payload.btnRightVariant)
    commit('SET_ACTION_BTN_RIGHT', payload.actionBtnRight)
    commit('SET_OPEN', true)
  },
  closeDialog ({ commit }) {
    commit('SET_HEADER', '')
    commit('SET_TITLE', '')
    commit('SET_BUTTON_LEFT_VARIANT', 'secondary')
    commit('SET_BUTTON_RIGHT_VARIANT', 'primary')
    commit('SET_ACTION_BTN_RIGHT', () => {})
    commit('SET_OPEN', false)
  }
}
