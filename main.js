import { createSSRApp } from 'vue'
import App from './App.vue'
import globalTheme from './mixins/globalTheme.js'

export function createApp() {
  const app = createSSRApp(App)

  // 全局注册主题 mixin
  app.mixin(globalTheme)

  return {
    app
  }
}
