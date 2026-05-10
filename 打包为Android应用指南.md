# 健身计划应用 - Android打包指南

## 项目概述

本项目已从微信小程序成功转换为 **uni-app** 版本，支持一键打包为 Android、iOS 应用，以及其他小程序平台。

## 已完成的功能

✅ 首页训练功能（含实时计时器）
✅ 动作库（20个默认动作 + 自定义动作）
✅ 日历打卡功能
✅ 训练历史记录
✅ 全局计时器（切换页面不停止）
✅ 励志鸡汤和鼓励系统
✅ 数据本地存储

## Android 打包步骤

### 方法一：使用 HBuilderX（推荐，最简单）

#### 第1步：下载并安装 HBuilderX
1. 访问 [HBuilderX 官网](https://www.dcloud.io/hbuilderx.html)
2. 下载 **App开发版**（包含 App 打包功能）
3. 解压并安装 HBuilderX

#### 第2步：导入项目
1. 打开 HBuilderX
2. 点击菜单栏：`文件` → `导入` → `从本地目录导入`
3. 选择项目目录：`d:\weixinxcx\uni-app-version`
4. 点击「选择文件夹」导入

#### 第3步：配置 App 图标和启动图（可选但推荐）
1. 在项目根目录创建 `unpackage` 文件夹（如不存在）
2. 在 `unpackage` 下创建 `res` 文件夹
3. 准备以下尺寸的图标和启动图：
   - 图标：1024x1024 PNG
   - 启动图：1080x1920 PNG
4. 在 HBuilderX 中右键项目 → `发行` → `原生App-云打包` → 配置图标和启动图

#### 第4步：云打包（免费方式）
1. 在 HBuilderX 中右键项目文件夹
2. 选择 `发行` → `原生App-云打包`
3. 填写打包信息：
   - **Android 包名**：`com.fitness.plan`（可自定义）
   - **证书**：选择「使用DCloud公用证书」（免费测试用）
   - **版本名称**：1.0.0
   - **版本号**：100
4. 点击「打包」按钮
5. 等待 2-5 分钟，HBuilderX 会下载 APK 文件

#### 第5步：安装到 Android 手机
1. 将生成的 APK 文件传输到 Android 手机
2. 在手机上点击 APK 文件安装
3. 如提示「允许安装未知来源应用」，点击允许

---

### 方法二：使用命令行 + Android Studio（高级方式）

#### 前置要求
- 安装 Node.js (v14+)
- 安装 JDK 8+
- 安装 Android Studio
- 配置 Android SDK 和环境变量

#### 步骤
1. **安装 Vue CLI 和 uni-app CLI**
   ```bash
   npm install -g @vue/cli
   vue create -p dcloudio/uni-preset-vue fitness-app
   ```

2. **将我们的代码复制到新项目**

3. **打包为 App 资源**
   ```bash
   npm run build:app-plus
   ```

4. **使用 Android Studio 打开并编译**
   - 打开 `unpackage/dist/build/app-plus` 目录
   - 使用 Android Studio 编译生成 APK

---

## 项目结构说明

```
uni-app-version/
├── pages/                  # 页面文件
│   ├── index/             # 首页（训练页面）
│   ├── exercises/         # 动作库
│   ├── calendar/          # 打卡日历
│   └── history/           # 历史记录
├── store/                 # 全局状态管理
│   └── index.js          # 计时器状态管理
├── utils/                 # 工具函数
│   └── index.js          # 通用函数、励志语录等
├── static/                # 静态资源
│   └── css/
│       └── common.css    # 公共样式
├── App.vue               # 应用入口
├── pages.json            # 页面路由和配置
├── manifest.json         # 应用打包配置
└── 打包为Android应用指南.md
```

## 常见问题

### Q: 云打包失败怎么办？
A: 
1. 检查 manifest.json 配置是否正确
2. 确保网络连接正常
3. 尝试重新登录 HBuilderX 账号

### Q: APK 安装失败？
A:
1. 检查手机是否允许安装未知来源应用
2. 确认手机 Android 版本是否兼容
3. 尝试卸载旧版本后重新安装

### Q: 如何修改应用名称和图标？
A:
- 应用名称：修改 `manifest.json` 中的 `name` 字段
- 应用图标：在 HBuilderX 云打包时上传 1024x1024 的 PNG 图标

### Q: 如何发布到应用商店？
A:
- 需要申请正式的数字证书（不要用 DCloud 公用证书）
- 注册各大应用商店开发者账号
- 按照各平台要求提交审核

## 后续优化建议

1. **添加 TabBar 图标**：在 `static/` 目录下添加图标文件
2. **优化启动页**：设计精美的启动画面
3. **添加隐私政策**：如需要上架应用商店
4. **添加权限说明**：说明应用需要的权限用途
5. **数据备份功能**：添加云端同步功能

## 技术支持

如有问题，可以参考：
- [uni-app 官方文档](https://uniapp.dcloud.io/)
- [HBuilderX 使用指南](https://hx.dcloud.net.cn/)
