export const state = () => ({
  isOpen: false,
  header: '',
  title: '',
  message: '',
  detailMessage: '',
  iconMessage: '',
  iconColor: '',
  btnLeftVariant: 'secondary',
  btnRightVariant: 'primary',
  btnLeftLabel: 'Batal',
  btnRightLabel: 'Ya, saya yakin',
  dialogType: 'confirmation',
  progressValue: 0,
  actionBtnLeft: () => {},
  actionBtnRight: () => {}
})

export const mutations = {
  SET_OPEN (state, payload) {
    state.isOpen = payload
  },
  SET_MESSAGE (state, payload) {
    state.message = payload
  },
  SET_DETAIL_MESSAGE (state, payload) {
    state.detailMessage = payload
  },
  SET_ICON_MESSAGE (state, payload) {
    state.iconMessage = payload
  },
  SET_ICON_COLOR (state, payload) {
    state.iconColor = payload
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
  SET_ACTION_BTN_LEFT (state, payload) {
    state.actionBtnLeft = payload
  },
  SET_ACTION_BTN_RIGHT (state, payload) {
    state.actionBtnRight = payload
  },
  SET_BUTTON_LEFT_LABEL (state, payload) {
    state.btnLeftLabel = payload
  },
  SET_BUTTON_RIGHT_LABEL (state, payload) {
    state.btnRightLabel = payload
  },
  SET_DIALOG_TYPE (state, payload) {
    state.dialogType = payload
  },
  SET_PROGRESS_VALUE (state, payload) {
    state.progressValue = payload
  }
}

export const getters = {
  open (state) {
    return state.isOpen
  },
  message (state) {
    return state.message
  },
  detailMessage (state) {
    return state.detailMessage
  },
  iconMessage (state) {
    return state.iconMessage
  },
  iconColor (state) {
    return state.iconColor
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
  actionBtnLeft (state) {
    return state.actionBtnLeft
  },
  actionBtnRight (state) {
    return state.actionBtnRight
  },
  btnLeftLabel (state) {
    return state.btnLeftLabel
  },
  btnRightLabel (state) {
    return state.btnRightLabel
  },
  dialogType (state) {
    return state.dialogType
  },
  progressValue (state) {
    return state.progressValue
  }
}

export const actions = {
  showDialog ({ commit, state }, payload) {
    commit('SET_HEADER', payload.header || state.header)
    commit('SET_TITLE', payload.title)
    commit('SET_MESSAGE', payload.message)
    commit('SET_DETAIL_MESSAGE', payload.detailMessage)
    commit('SET_ICON_MESSAGE', payload.iconMessage)
    commit('SET_ICON_COLOR', payload.iconColor)
    commit('SET_BUTTON_LEFT_VARIANT', payload.btnLeftVariant || state.btnLeftVariant)
    commit('SET_BUTTON_RIGHT_VARIANT', payload.btnRightVariant || state.btnRightVariant)
    commit('SET_BUTTON_LEFT_LABEL', payload.btnLeftLabel || state.btnLeftLabel)
    commit('SET_BUTTON_RIGHT_LABEL', payload.btnRightLabel || state.btnRightLabel)
    commit('SET_ACTION_BTN_LEFT', payload.actionBtnLeft)
    commit('SET_ACTION_BTN_RIGHT', payload.actionBtnRight)
    commit('SET_DIALOG_TYPE', payload.dialogType || state.dialogType)
    commit('SET_PROGRESS_VALUE', payload.progressValue || state.progressValue)
    commit('SET_OPEN', true)
  },
  closeDialog ({ commit }) {
    commit('SET_HEADER', '')
    commit('SET_TITLE', '')
    commit('SET_MESSAGE', '')
    commit('SET_DETAIL_MESSAGE', '')
    commit('SET_ICON_MESSAGE', '')
    commit('SET_ICON_COLOR', '')
    commit('SET_BUTTON_LEFT_VARIANT', 'secondary')
    commit('SET_BUTTON_RIGHT_VARIANT', 'primary')
    commit('SET_BUTTON_LEFT_LABEL', 'Batal')
    commit('SET_BUTTON_RIGHT_LABEL', 'Ya, saya yakin')
    commit('SET_DIALOG_TYPE', 'confirmation')
    commit('SET_ACTION_BTN_RIGHT', () => {})
    commit('SET_PROGRESS_VALUE', 0)
    commit('SET_OPEN', false)
  },
  async closeDialogAction ({ dispatch, commit }, customAction) {
    await customAction()
    await dispatch('closeDialog')
    await commit('SET_ACTION_BTN_LEFT', () => {})
  }
}
