import themeStore from '../store/themeStore.js';

export default {
  data() {
    return {
      themeColors: null
    };
  },

  onLoad() {
    this.loadThemeColors();
  },

  onShow() {
    this.loadThemeColors();
  },

  methods: {
    loadThemeColors() {
      this.themeColors = themeStore.getColors();
    }
  }
};
