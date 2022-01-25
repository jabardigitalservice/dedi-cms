export const state = () => ({
  isOpen: false,
  type: 'info',
  message: ''
})

export const mutations = {
  SET_OPEN (state, payload) {
    state.isOpen = payload
  },
  SET_MESSAGE (state, payload) {
    state.message = payload
  },
  SET_TYPE (state, payload) {
    state.type = payload
  }
}

export const getters = {
  open (state) {
    return state.isOpen
  },
  message (state) {
    return state.message
  },
  type (state) {
    return state.type
  }
}

export const actions = {
  showToast ({ commit }, payload) {
    commit('SET_TYPE', payload.type)
    commit('SET_MESSAGE', payload.message)
    commit('SET_OPEN', true)
  },
  closeToast ({ commit }) {
    commit('SET_TYPE', 'info')
    commit('SET_MESSAGE', '')
    commit('SET_OPEN', false)
  }
}
