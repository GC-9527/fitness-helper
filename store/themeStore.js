import { themes, getTheme } from '../static/css/themes.js';

const THEME_KEY = 'app_theme';

const themeStore = {
  state: {
    currentTheme: 'dark',
    themeData: null
  },

  init() {
    this.loadTheme();
  },

  loadTheme() {
    try {
      const savedTheme = uni.getStorageSync(THEME_KEY);
      if (savedTheme && themes[savedTheme]) {
        this.state.currentTheme = savedTheme;
      }
    } catch (e) {
      console.error('加载主题失败:', e);
    }
    this.state.themeData = getTheme(this.state.currentTheme);
    this.applyTheme();
  },

  setTheme(themeName) {
    if (!themes[themeName]) {
      console.error('主题不存在:', themeName);
      return false;
    }

    this.state.currentTheme = themeName;
    this.state.themeData = themes[themeName];

    try {
      uni.setStorageSync(THEME_KEY, themeName);
    } catch (e) {
      console.error('保存主题失败:', e);
    }

    this.applyTheme();

    // 触发全局主题变化事件
    try {
      uni.$emit('themeChanged', this.getColors());
    } catch (e) {
      console.error('触发主题变化事件失败:', e);
    }

    return true;
  },

  getTheme() {
    return this.state.currentTheme;
  },

  getThemeData() {
    if (!this.state.themeData) {
      this.state.themeData = getTheme(this.state.currentTheme);
    }
    return this.state.themeData;
  },

  getColors() {
    const theme = this.getThemeData();
    return theme ? theme.colors : getTheme('dark').colors;
  },

  applyTheme() {
    const colors = this.getColors();

    // 设置 HTML 元素的 data-theme 属性（仅在 H5 环境下）
    try {
      if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.setAttribute('data-theme', this.state.currentTheme);
      }
    } catch (e) {
      // 非 H5 环境，忽略错误
    }

    // 根据主题样式判断是深色还是浅色
    const themeData = this.getThemeData();
    const isDarkTheme = themeData.style === 'dark';

    // 设置导航栏颜色
    uni.setNavigationBarColor({
      frontColor: isDarkTheme ? '#ffffff' : '#000000',
      backgroundColor: colors.background,
      success: () => {},
      fail: () => {}
    });

    // 设置 TabBar 颜色
    // 注意：borderStyle 仅支持 'black' 或 'white'，根据主题类型选择
    if (uni.setTabBarStyle) {
      uni.setTabBarStyle({
        color: isDarkTheme ? '#94a3b8' : '#64748b',
        selectedColor: colors.primary,
        backgroundColor: colors.background,
        borderStyle: isDarkTheme ? 'white' : 'black',
        success: () => {},
        fail: () => {}
      });
    }

    // H5 环境下 uni.setBackgroundColor 可能不存在，添加容错处理
    if (uni.setBackgroundColor) {
      uni.setBackgroundColor({
        backgroundColor: colors.background,
        backgroundColorTop: colors.background,
        backgroundColorBottom: colors.background,
        success: () => {},
        fail: () => {}
      });
    }
  },

  getAllThemes() {
    return Object.entries(themes).map(([key, theme]) => ({
      key,
      name: theme.name,
      nameEn: theme.nameEn,
      style: theme.style
    }));
  }
};

export default themeStore;
