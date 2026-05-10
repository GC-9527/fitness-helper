export const themes = {
  // 主题1: 深色科技 - 深蓝灰科技感
  dark: {
    name: '深色科技',
    nameEn: 'Dark Tech',
    style: 'dark',
    colors: {
      // 主色调 - 科技蓝
      primary: '#3b82f6',
      primaryLight: '#60a5fa',
      primaryDark: '#1d4ed8',
      secondary: '#06b6d4',
      accent: '#22d3ee',
      // 背景色 - 深蓝灰层次
      background: '#0f172a',
      backgroundSecondary: '#1e293b',
      backgroundTertiary: '#334155',
      surface: '#1e293b',
      surfaceHover: '#334155',
      // 边框色 - TabBar边框使用更浅的颜色以便可见
      border: '#475569',
      borderLight: '#64748b',
      // 文字色
      text: '#f8fafc',
      textSecondary: '#94a3b8',
      textTertiary: '#64748b',
      // 功能色
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
      info: '#3b82f6',
      // 渐变
      gradientPrimary: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      gradientSuccess: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      gradientCard1: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      gradientCard2: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      gradientCard3: 'linear-gradient(135deg, #8b5cf6 0%, #5b21b6 100%)',
      gradientCard4: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      // 特殊效果
      glassBg: 'rgba(30, 41, 59, 0.6)',
      glassBorder: 'rgba(255, 255, 255, 0.08)',
      chartGrid: 'rgba(255,255,255,0.05)',
      chartAxis: 'rgba(255,255,255,0.2)'
    }
  },

  // 主题2: 清新浅色 - 真正的浅色主题
  light: {
    name: '清新浅色',
    nameEn: 'Fresh Light',
    style: 'light',
    colors: {
      // 主色调 - 活力青
      primary: '#0891b2',
      primaryLight: '#06b6d4',
      primaryDark: '#0e7490',
      secondary: '#14b8a6',
      accent: '#2dd4bf',
      // 背景色 - 纯白层次
      background: '#ffffff',
      backgroundSecondary: '#f8fafc',
      backgroundTertiary: '#f1f5f9',
      surface: '#ffffff',
      surfaceHover: '#f1f5f9',
      // 边框色 - TabBar边框使用更深的颜色以便可见
      border: '#94a3b8',
      borderLight: '#cbd5e1',
      // 文字色 - 深灰
      text: '#0f172a',
      textSecondary: '#475569',
      textTertiary: '#94a3b8',
      // 功能色
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
      info: '#0891b2',
      // 渐变
      gradientPrimary: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
      gradientSuccess: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      gradientCard1: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
      gradientCard2: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
      gradientCard3: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      gradientCard4: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
      // 特殊效果
      glassBg: 'rgba(255, 255, 255, 0.8)',
      glassBorder: 'rgba(0, 0, 0, 0.08)',
      chartGrid: 'rgba(0,0,0,0.05)',
      chartAxis: 'rgba(0,0,0,0.2)'
    }
  },

  // 主题3: 暖色黄昏 - 暖橙红色调
  sunset: {
    name: '暖色黄昏',
    nameEn: 'Warm Sunset',
    style: 'dark',
    colors: {
      // 主色调 - 暖橙
      primary: '#f97316',
      primaryLight: '#fb923c',
      primaryDark: '#ea580c',
      secondary: '#f59e0b',
      accent: '#fbbf24',
      // 背景色 - 暖棕暗色
      background: '#1c1917',
      backgroundSecondary: '#292524',
      backgroundTertiary: '#44403c',
      surface: '#292524',
      surfaceHover: '#44403c',
      // 边框色 - TabBar边框使用更浅的颜色以便可见
      border: '#78716c',
      borderLight: '#a8a29e',
      // 文字色 - 暖白
      text: '#fafaf9',
      textSecondary: '#d6d3d1',
      textTertiary: '#a8a29e',
      // 功能色
      success: '#22c55e',
      warning: '#f59e0b',
      danger: '#ef4444',
      info: '#06b6d4',
      // 渐变
      gradientPrimary: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      gradientSuccess: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
      gradientCard1: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
      gradientCard2: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
      gradientCard3: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
      gradientCard4: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
      // 特殊效果
      glassBg: 'rgba(41, 37, 36, 0.7)',
      glassBorder: 'rgba(255, 255, 255, 0.1)',
      chartGrid: 'rgba(255,255,255,0.05)',
      chartAxis: 'rgba(255,255,255,0.2)'
    }
  },

  // 主题4: 森林自然 - 绿色系自然风
  forest: {
    name: '森林自然',
    nameEn: 'Forest Nature',
    style: 'dark',
    colors: {
      // 主色调 - 森林绿
      primary: '#22c55e',
      primaryLight: '#4ade80',
      primaryDark: '#16a34a',
      secondary: '#10b981',
      accent: '#34d399',
      // 背景色 - 深绿基调
      background: '#052e16',
      backgroundSecondary: '#064e3b',
      backgroundTertiary: '#065f46',
      surface: '#064e3b',
      surfaceHover: '#065f46',
      // 边框色 - TabBar边框使用更浅的颜色以便可见
      border: '#10b981',
      borderLight: '#34d399',
      // 文字色 - 浅绿白
      text: '#ecfdf5',
      textSecondary: '#6ee7b7',
      textTertiary: '#34d399',
      // 功能色
      success: '#22c55e',
      warning: '#eab308',
      danger: '#ef4444',
      info: '#06b6d4',
      // 渐变
      gradientPrimary: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
      gradientSuccess: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      gradientCard1: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)',
      gradientCard2: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
      gradientCard3: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
      gradientCard4: 'linear-gradient(135deg, #84cc16 0%, #a3e635 100%)',
      // 特殊效果
      glassBg: 'rgba(6, 78, 59, 0.7)',
      glassBorder: 'rgba(52, 211, 153, 0.15)',
      chartGrid: 'rgba(52,211,153,0.1)',
      chartAxis: 'rgba(110,231,183,0.3)'
    }
  },

  // 主题5: 暗紫神秘 - 深紫色调
  midnight: {
    name: '暗紫神秘',
    nameEn: 'Midnight Purple',
    style: 'dark',
    colors: {
      // 主色调 - 神秘紫
      primary: '#a855f7',
      primaryLight: '#c084fc',
      primaryDark: '#7c3aed',
      secondary: '#8b5cf6',
      accent: '#c084fc',
      // 背景色 - 深紫黑
      background: '#0f0518',
      backgroundSecondary: '#1a0b2e',
      backgroundTertiary: '#2d1b4e',
      surface: '#1a0b2e',
      surfaceHover: '#2d1b4e',
      // 边框色 - TabBar边框使用更浅的颜色以便可见
      border: '#7c3aed',
      borderLight: '#a855f7',
      // 文字色 - 浅紫白
      text: '#faf5ff',
      textSecondary: '#d8b4fe',
      textTertiary: '#a855f7',
      // 功能色
      success: '#22c55e',
      warning: '#fbbf24',
      danger: '#f87171',
      info: '#60a5fa',
      // 渐变
      gradientPrimary: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
      gradientSuccess: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
      gradientCard1: 'linear-gradient(135deg, #a855f7 0%, #c084fc 100%)',
      gradientCard2: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
      gradientCard3: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
      gradientCard4: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
      // 特殊效果
      glassBg: 'rgba(26, 11, 46, 0.8)',
      glassBorder: 'rgba(168, 85, 247, 0.2)',
      chartGrid: 'rgba(168,85,247,0.1)',
      chartAxis: 'rgba(216,180,254,0.3)'
    }
  }
};

export const themeList = Object.keys(themes);

export function getTheme(themeName) {
  return themes[themeName] || themes.dark;
}

export function getAllThemes() {
  return Object.entries(themes).map(([key, theme]) => ({
    key,
    name: theme.name,
    nameEn: theme.nameEn,
    style: theme.style,
    colors: theme.colors
  }));
}
