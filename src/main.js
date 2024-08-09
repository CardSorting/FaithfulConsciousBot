import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createStore } from 'vuex';
import axios from 'axios';
import App from './App.vue';
import Home from './views/Home.vue';
import Canvas from './components/Canvas.vue';
import './assets/tailwind.css';

// Create Axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Vuex store
const store = createStore({
  state() {
    return {
      currentProject: null,
      loading: false,
      error: null,
    };
  },
  mutations: {
    SET_CURRENT_PROJECT(state, project) {
      state.currentProject = project;
    },
    SET_LOADING(state, isLoading) {
      state.loading = isLoading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
  },
  actions: {
    async performProjectAction({ commit }, { actionType, projectData = null, projectId = null }) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      try {
        let response;
        switch (actionType) {
          case 'load':
            response = await api.get(`/projects/${projectId}`);
            break;
          case 'save':
            response = await api.put(`/projects/${projectId}`, projectData);
            break;
          case 'create':
            response = await api.post('/projects', projectData);
            break;
          case 'delete':
            await api.delete(`/projects/${projectId}`);
            commit('SET_CURRENT_PROJECT', null);
            return;
          default:
            throw new Error('Invalid action type');
        }
        commit('SET_CURRENT_PROJECT', response.data);
        return actionType === 'create' ? response.data.id : undefined;
      } catch (error) {
        console.error(`Error ${actionType}ing project:`, error);
        commit('SET_ERROR', `Failed to ${actionType} project. Please try again.`);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    loadProject({ dispatch }, projectId) {
      return dispatch('performProjectAction', { actionType: 'load', projectId });
    },
    saveProject({ dispatch }, projectData) {
      return dispatch('performProjectAction', { actionType: 'save', projectData });
    },
    createProject({ dispatch }, initialData) {
      return dispatch('performProjectAction', { actionType: 'create', projectData: initialData });
    },
    deleteProject({ dispatch }, projectId) {
      return dispatch('performProjectAction', { actionType: 'delete', projectId });
    },
  },
  getters: {
    getCurrentProject: (state) => state.currentProject,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
  },
});

// Router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { 
      path: '/', 
      name: 'Home',
      component: Home 
    },
    { 
      path: '/project/:projectId', 
      name: 'Project',
      component: Canvas,
      props: true
    },
    {
      path: '/new-project',
      name: 'NewProject',
      component: Canvas,
      props: { newProject: true }
    }
  ]
});

// Navigation guard
router.beforeEach((to, from, next) => {
  if (to.name === 'Project' && to.params.projectId) {
    store.dispatch('loadProject', to.params.projectId)
      .then(() => next())
      .catch(() => next('/'));
  } else {
    next();
  }
});

// Create Vue app
const app = createApp(App);

// Use router and store
app.use(router);
app.use(store);

// Global filters
app.config.globalProperties.$filters = {
  currencyUSD(value) {
    return '$' + value.toFixed(2);
  },
  formatDate(value) {
    return new Date(value).toLocaleDateString();
  }
};

// Global error handler
app.config.errorHandler = (err, vm, info) => {
  console.error('Unhandled error:', err, info);
  store.commit('SET_ERROR', 'An unexpected error occurred. Please try again.');
};

// Mount the app
app.mount('#app');