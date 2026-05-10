import themeStore from '../store/themeStore.js';

/**
 * 全局主题 mixin
 * 为所有页面提供主题样式支持
 */
export default {
  data() {
    return {
      themeStyle: {}
    };
  },

  onLoad() {
    this.updateThemeStyle();
    // 监听主题变化
    uni.$on('themeChanged', this.handleThemeChange);
  },

  onUnload() {
    // 取消监听
    uni.$off('themeChanged', this.handleThemeChange);
  },

  onShow() {
    // 页面显示时更新主题
    this.updateThemeStyle();
  },

  methods: {
    /**
     * 更新主题样式
     */
    updateThemeStyle() {
      const colors = themeStore.getColors();
      if (colors) {
        // 构建 CSS 变量样式
        this.themeStyle = this.buildThemeStyle(colors);

        // 在小程序端，尝试设置 page 元素的背景色
        // #ifdef MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-QQ
        try {
          const pages = getCurrentPages();
          const currentPage = pages[pages.length - 1];
          if (currentPage) {
            // 设置页面背景色
            if (currentPage.$page) {
              currentPage.$page.backgroundColor = colors.background;
            }
          }
        } catch (e) {
          console.error('设置页面背景色失败:', e);
        }
        // #endif
      }
    },

    /**
     * 构建主题样式对象
     */
    buildThemeStyle(colors) {
      // 返回 CSS 变量和内联样式的组合
      return {
        // CSS 变量（H5 端使用）
        '--primary': colors.primary,
        '--primary-light': colors.primaryLight,
        '--primary-dark': colors.primaryDark,
        '--secondary': colors.secondary,
        '--accent': colors.accent,
        '--background': colors.background,
        '--background-secondary': colors.backgroundSecondary,
        '--background-tertiary': colors.backgroundTertiary,
        '--surface': colors.surface,
        '--surface-hover': colors.surfaceHover,
        '--border': colors.border,
        '--border-light': colors.borderLight,
        '--text': colors.text,
        '--text-secondary': colors.textSecondary,
        '--text-tertiary': colors.textTertiary,
        '--success': colors.success,
        '--warning': colors.warning,
        '--danger': colors.danger,
        '--info': colors.info,
        // 直接样式（小程序端备用）
        'background-color': colors.background,
        'color': colors.text
      };
    },

    /**
     * 处理主题变化事件
     */
    handleThemeChange(colors) {
      if (colors) {
        this.themeStyle = this.buildThemeStyle(colors);
      }
    }
  }
};
