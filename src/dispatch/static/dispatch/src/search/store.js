import SearchApi from "@/search/api"
import { getField, updateField } from "vuex-map-fields"

const getDefaultSelectedState = () => {
  return {
    expression: null,
    description: null,
    name: null,
    type: null,
    loading: false,
    subject: "incident",
    previewRows: {
      items: [],
      total: null,
    },
    previewRowsLoading: false,
    step: 1,
    filters: {
      incident_type: [],
      case_type: [],
      case_priority: [],
      incident_priority: [],
      status: [],
      tag: [],
      tag_type: [],
      project: [],
      visibility: [],
    },
  }
}

const state = {
  results: {
    incidents: [],
    cases: [],
    tasks: [],
    documents: [],
    tags: [],
    queries: [],
    sources: [],
  },
  query: "",
  type: ["Document", "Incident", "Case", "Tag", "Task", "Source", "Query"],
  dialogs: {
    showCreate: false,
  },
  loading: false,
  selected: {
    ...getDefaultSelectedState(),
  },
}

const getters = {
  getField,
}

const actions = {
  setQuery({ commit }, query) {
    commit("SET_QUERY", query)
  },
  setModels({ commit }, models) {
    commit("SET_MODELS", models)
  },
  getResults({ commit, state }) {
    commit("SET_LOADING", true)
    return SearchApi.search(state.query, state.type)
      .then((response) => {
        commit("SET_RESULTS", response.data.results)
        commit("SET_LOADING", false)
      })
      .catch(() => {
        commit("SET_LOADING", false)
      })
  },
  showCreateDialog({ commit }) {
    commit("SET_DIALOG_SHOW_CREATE", true)
  },
  closeCreateDialog({ commit }) {
    commit("SET_DIALOG_SHOW_CREATE", false)
  },
  save({ commit }) {
    commit("SET_LOADING", true)
    if (!state.selected.id) {
      return SearchApi.create(state.selected)
        .then((resp) => {
          commit(
            "notification_backend/addBeNotification",
            { text: "Search filter created successfully.", type: "success" },
            { root: true }
          )
          commit("SET_LOADING", false)
          commit("SET_DIALOG_SHOW_CREATE", false)
          return resp.data
        })
        .catch(() => {
          commit("SET_LOADING", false)
        })
    } else {
      return SearchApi.update(state.selected.id, state.selected)
        .then(() => {
          commit(
            "notification_backend/addBeNotification",
            { text: "Search filter updated successfully.", type: "success" },
            { root: true }
          )
          commit("SET_LOADING", false)
        })
        .catch(() => {
          commit("SET_LOADING", false)
        })
    }
  },
}

const mutations = {
  updateField,
  SET_LOADING(state, value) {
    state.loading = value
  },
  SET_RESULTS(state, results) {
    state.results = results
  },
  SET_QUERY(state, query) {
    state.query = query
  },
  SET_MODELS(state, models) {
    state.models = models
  },
  SET_DIALOG_SHOW_CREATE(state, value) {
    state.dialogs.showCreate = value
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
