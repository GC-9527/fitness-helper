import themeStore from '../store/themeStore.js';

/**
 * 获取当前主题的 CSS 变量样式对象
 * 用于在小程序端动态应用主题
 */
export function getThemeCssVars() {
  const colors = themeStore.getColors();
  if (!colors) return {};

  return {
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
    '--info': colors.info
  };
}

/**
 * 获取页面根元素的样式
 * 用于应用到 page 或最外层容器
 */
export function getPageThemeStyle() {
  const colors = themeStore.getColors();
  if (!colors) return {};

  return {
    backgroundColor: colors.background,
    color: colors.text
  };
}

/**
 * 监听主题变化
 */
export function onThemeChange(callback) {
  // 在小程序端，可以通过全局事件或存储监听来实现
  uni.$on('themeChanged', callback);
}

/**
 * 触发主题变化事件
 */
export function emitThemeChange() {
  uni.$emit('themeChanged', themeStore.getColors());
}
