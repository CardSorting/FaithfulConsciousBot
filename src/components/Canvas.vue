<template>
  <div class="flex w-full h-full">
    <div v-if="isLoading" class="absolute inset-0 bg-white bg-opacity-80 flex flex-col justify-center items-center">
      <div class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500"></div>
      <p>Loading project...</p>
    </div>
    <div v-else-if="error" class="text-red-500 text-center p-5">
      {{ error }}
      <button @click="retryOperation" class="mt-2 px-4 py-2 bg-green-500 text-white rounded">Retry</button>
    </div>
    <div v-else class="flex w-full h-full">
      <div class="w-64 p-5 bg-gray-100 flex flex-col border-r border-gray-300">
        <div class="mb-5">
          <h2 class="text-lg font-bold text-gray-800">Upload Images</h2>
          <button @click="triggerFileUpload" class="mb-4 px-4 py-2 bg-blue-500 text-white rounded flex items-center justify-center">
            <i class="fas fa-upload mr-2"></i> Upload images
          </button>
          <p class="text-sm text-gray-600 mb-1">File types accepted: jpg, jpeg, bmp, png, gif, tif, tiff</p>
          <p class="text-sm text-gray-600 mb-4">Min resolution: 816 x 1110 pixels (300DPI) | Max file size: 32MB</p>
          <input 
            type="file" 
            ref="fileInput" 
            @change="handleFileUpload" 
            accept="image/*" 
            class="hidden"
          >
          <button @click="clearCanvas" class="px-4 py-2 bg-red-500 text-white rounded flex items-center justify-center">
            <i class="fas fa-trash-alt mr-2"></i> Clear Canvas
          </button>
        </div>
        <div>
          <h2 class="text-lg font-bold text-gray-800 mb-2">Select Card Size</h2>
          <div v-for="(sizes, category) in cardSizes" :key="category" class="mb-4">
            <p class="text-md font-semibold text-gray-700 mb-2">{{ category }}:</p>
            <div class="grid grid-cols-2 gap-2">
              <button v-for="size in sizes" 
                      :key="size.value" 
                      @click="selectCardSize(size)" 
                      :class="{'bg-blue-500 text-white': selectedSize.value === size.value, 'bg-gray-500 text-white': selectedSize.value !== size.value }" 
                      class="px-4 py-2 rounded">
                {{ size.label ? `${size.label}: ${size.dimensions}` : size.dimensions }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div 
        class="flex-grow flex justify-center items-center bg-gray-200 border-2 border-dashed border-gray-300" 
        :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"
        @drop="onDrop"
        @dragover.prevent
        @dragenter.prevent
      >
        <img 
          v-if="currentProject && currentProject.image" 
          :src="currentProject.image" 
          :alt="'Project ' + currentProject.id"
          :class="['max-w-full', 'max-h-full', `filter-${currentProject.appliedAttribute}`]"
        >
        <p v-else class="text-gray-600">Drag and drop an image here or use the upload button</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Canvas',
  props: {
    projectId: {
      type: String,
      default: null
    },
    newProject: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedSize: {},
      cardSizes: {
        'Invitation Cards': [
          { value: '5x7', dimensions: '5x7' },
          { value: '4x6', dimensions: '4x6' },
          { value: '5.5x8.5', dimensions: '5.5x8.5' },
          { value: '6x9', dimensions: '6x9' },
        ],
        'Business Cards': [
          { value: '3.5x2', dimensions: '3.5x2' },
          { value: '2x2', dimensions: '2x2' },
          { value: '3.5x4', dimensions: '3.5x4' },
          { value: '2x3.5', dimensions: '2x3.5' },
        ],
        'Collectible Cards': [
          { value: 'bridge', label: 'Bridge', dimensions: '2.25x3.5' },
          { value: 'poker', label: 'Poker', dimensions: '2.5x3.5' },
          { value: 'tarot', label: 'Tarot', dimensions: '2.75x4.75' },
          { value: 'jumbo', label: 'Jumbo', dimensions: '3.5x5.75' },
          { value: 'giant', label: 'Giant', dimensions: '5x7' },
        ],
      },
      canvasWidth: 500,
      canvasHeight: 700,
      retryFunction: null
    };
  },
  computed: {
    ...mapGetters(['getCurrentProject', 'isLoading', 'getError']),
    currentProject() {
      return this.getCurrentProject;
    },
    error() {
      return this.getError;
    }
  },
  watch: {
    projectId: {
      immediate: true,
      handler(newProjectId) {
        if (newProjectId) {
          this.loadProject(newProjectId);
        }
      }
    }
  },
  created() {
    this.initializeProject();
  },
  beforeUnmount() {
    this.saveCurrentProject();
  },
  methods: {
    ...mapActions(['loadProject', 'saveProject', 'createProject', 'deleteProject']),

    async initializeProject() {
      this.retryFunction = this.newProject ? this.createNewProject : () => this.loadProject(this.projectId);
      await this.retryFunction();
    },

    async createNewProject() {
      try {
        const initialData = { image: null, attributes: {}, appliedAttribute: null };
        const newProjectId = await this.createProject(initialData);
        this.$router.replace({ name: 'Project', params: { projectId: newProjectId.toString() } });
      } catch (error) {
        console.error('Failed to create new project:', error);
      }
    },

    async saveCurrentProject() {
      if (this.currentProject?.id) {
        this.retryFunction = this.saveCurrentProject;
        try {
          await this.saveProject({
            ...this.currentProject,
            attributes: { ...this.currentProject.attributes, cardSize: this.selectedSize }
          });
        } catch (error) {
          console.error('Failed to save project:', error);
        }
      }
    },

    triggerFileUpload() {
      this.$refs.fileInput.click();
    },

    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) this.processUploadedFile(file);
    },

    onDrop(event) {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (file) this.processUploadedFile(file);
    },

    processUploadedFile(file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        await this.saveProject({ ...this.currentProject, image: e.target.result });
      };
      reader.onerror = (error) => console.error('Error reading file:', error);
      reader.readAsDataURL(file);
    },

    selectCardSize(size) {
      this.selectedSize = size;
      const [width, height] = size.dimensions.split('x').map(Number);
      this.canvasWidth = width * 100;
      this.canvasHeight = height * 100;
      this.saveProject({
        ...this.currentProject,
        attributes: { ...this.currentProject.attributes, cardSize: size }
      });
    },

    clearCanvas() {
      this.saveProject({ ...this.currentProject, image: null });
    },

    retryOperation() {
      if (this.retryFunction) this.retryFunction();
    },

    async deleteCurrentProject() {
      if (this.currentProject?.id) {
        try {
          await this.deleteProject(this.currentProject.id);
          this.$router.push({ name: 'Home' });
        } catch (error) {
          console.error('Failed to delete project:', error);
        }
      }
    }
  }
}
</script>

<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css";

.spinner-border {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>