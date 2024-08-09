import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    customizations: {},
    user: null,
    currentProject: {
      id: null,
      image: null,
      attributes: {
        cardSize: null,
      },
      appliedAttribute: null,
    },
    isLoading: false,
    error: null,
  },
  getters: {
    getCustomizations: (state) => state.customizations,
    getUser: (state) => state.user,
    getCurrentProject: (state) => state.currentProject,
    isLoading: (state) => state.isLoading,
    getError: (state) => state.error,
  },
  mutations: {
    UPDATE_CUSTOMIZATIONS(state, customizations) {
      state.customizations = { ...state.customizations, ...customizations };
    },
    SET_USER(state, user) {
      state.user = user;
    },
    SET_CURRENT_PROJECT(state, project) {
      state.currentProject = project;
    },
    UPDATE_PROJECT_DATA(state, data) {
      if (state.currentProject) {
        state.currentProject = { ...state.currentProject, ...data };
      }
    },
    SET_PROJECT_ATTRIBUTE(state, { key, value }) {
      if (state.currentProject && state.currentProject.attributes) {
        state.currentProject.attributes[key] = value;
      }
    },
    SET_APPLIED_ATTRIBUTE(state, attribute) {
      if (state.currentProject) {
        state.currentProject.appliedAttribute = attribute;
      }
    },
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
  },
  actions: {
    updateCustomizations({ commit }, customizations) {
      commit('UPDATE_CUSTOMIZATIONS', customizations);
    },
    async login({ commit }, credentials) {
      try {
        const response = await axios.post('/api/login', credentials);
        commit('SET_USER', response.data);
      } catch (error) {
        console.error('Error during login:', error);
        commit('SET_ERROR', 'Login failed. Please try again.');
      }
    },
    logout({ commit }) {
      commit('SET_USER', null);
    },
    async loadProject({ commit }, projectId) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      try {
        const response = await axios.get(`/api/projects/${projectId}`);
        commit('SET_CURRENT_PROJECT', response.data);
      } catch (error) {
        console.error('Error loading project:', error);
        commit('SET_ERROR', 'Failed to load project. Please try again.');
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async saveProject({ state, commit }) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      try {
        if (state.currentProject) {
          const response = await axios.post(`/api/projects/${state.currentProject.id}`, state.currentProject);
          commit('SET_CURRENT_PROJECT', response.data);
        }
      } catch (error) {
        console.error('Error saving project:', error);
        commit('SET_ERROR', 'Failed to save project. Please try again.');
      } finally {
        commit('SET_LOADING', false);
      }
    },
    setProjectAttribute({ commit }, attribute) {
      commit('SET_PROJECT_ATTRIBUTE', attribute);
    },
    setAppliedAttribute({ commit }, attribute) {
      commit('SET_APPLIED_ATTRIBUTE', attribute);
    },
    async createProject({ commit }, initialData) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      try {
        const response = await axios.post('/api/projects', initialData);
        commit('SET_CURRENT_PROJECT', response.data);
        return response.data.id;
      } catch (error) {
        console.error('Error creating project:', error);
        commit('SET_ERROR', 'Failed to create project. Please try again.');
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async deleteProject({ commit }, projectId) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      try {
        await axios.delete(`/api/projects/${projectId}`);
        commit('SET_CURRENT_PROJECT', null);
      } catch (error) {
        console.error('Error deleting project:', error);
        commit('SET_ERROR', 'Failed to delete project. Please try again.');
      } finally {
        commit('SET_LOADING', false);
      }
    },
  },
  modules: {},
});