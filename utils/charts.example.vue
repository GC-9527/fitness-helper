<!--
  uCharts 使用示例
  此文件展示了如何在 uni-app 中使用 charts.js 工具类
  使用时请将此代码复制到您的 .vue 文件中
-->

<template>
  <view class="charts-container">
    <!-- 训练容量趋势图 -->
    <view class="chart-section">
      <view class="chart-title">训练容量趋势</view>
      <view class="charts-box">
        <canvas 
          canvas-id="volumeChart" 
          id="volumeChart" 
          class="charts" 
          @touchstart="touchVolumeChart"
          @touchmove="touchVolumeChart"
          @touchend="touchVolumeChart"
        />
      </view>
    </view>

    <!-- 力量进步曲线 -->
    <view class="chart-section">
      <view class="chart-title">力量进步曲线</view>
      <view class="charts-box">
        <canvas 
          canvas-id="strengthChart" 
          id="strengthChart" 
          class="charts" 
          @touchstart="touchStrengthChart"
          @touchmove="touchStrengthChart"
          @touchend="touchStrengthChart"
        />
      </view>
    </view>

    <!-- 训练分布饼图 -->
    <view class="chart-section">
      <view class="chart-title">训练分布</view>
      <view class="charts-box">
        <canvas 
          canvas-id="distributionChart" 
          id="distributionChart" 
          class="charts" 
          @touchstart="touchDistributionChart"
          @touchend="touchDistributionChart"
        />
      </view>
    </view>
  </view>
</template>

<script>
import {
  initChart,
  getVolumeChartConfig,
  getStrengthChartConfig,
  getTrainingDistributionConfig,
  updateChart,
  destroyChart,
  handleChartTouch,
  formatVolumeData,
  formatStrengthData,
  formatDistributionData
} from '@/utils/charts.js';

export default {
  data() {
    return {
      cWidth: 375,
      cHeight: 250,
      pixelRatio: 1
    };
  },

  onReady() {
    // 获取系统信息
    const systemInfo = uni.getSystemInfoSync();
    this.pixelRatio = systemInfo.pixelRatio;
    
    // 计算图表尺寸 (rpx 转 px)
    this.cWidth = uni.upx2px(750);
    this.cHeight = uni.upx2px(500);
    
    // 初始化图表
    this.initCharts();
  },

  onUnload() {
    // 页面卸载时销毁图表
    destroyChart('volumeChart');
    destroyChart('strengthChart');
    destroyChart('distributionChart');
  },

  methods: {
    // 初始化所有图表
    initCharts() {
      this.initVolumeChart();
      this.initStrengthChart();
      this.initDistributionChart();
    },

    // 初始化训练容量趋势图
    initVolumeChart() {
      // 模拟数据 - 实际使用时从接口获取
      const mockRecords = [
        { date: '2024-01-01', weight: 60, reps: 10, sets: 3 },
        { date: '2024-01-03', weight: 62, reps: 10, sets: 3 },
        { date: '2024-01-05', weight: 65, reps: 8, sets: 4 },
        { date: '2024-01-08', weight: 65, reps: 10, sets: 4 },
        { date: '2024-01-10', weight: 70, reps: 8, sets: 4 },
        { date: '2024-01-12', weight: 70, reps: 10, sets: 4 },
        { date: '2024-01-15', weight: 75, reps: 6, sets: 5 }
      ];

      // 格式化数据
      const chartData = formatVolumeData(mockRecords);
      
      // 获取配置
      const config = getVolumeChartConfig(chartData);
      
      // 设置画布尺寸
      config.width = this.cWidth;
      config.height = this.cHeight;
      config.pixelRatio = this.pixelRatio;
      
      // 初始化图表
      initChart('volumeChart', config, this);
    },

    // 初始化力量进步曲线
    initStrengthChart() {
      // 模拟数据
      const mockRecords = [
        { date: '2024-01-01', weight: 60 },
        { date: '2024-01-05', weight: 62 },
        { date: '2024-01-08', weight: 65 },
        { date: '2024-01-12', weight: 68 },
        { date: '2024-01-15', weight: 70 },
        { date: '2024-01-18', weight: 72 },
        { date: '2024-01-22', weight: 75 }
      ];

      const chartData = formatStrengthData(mockRecords);
      const config = getStrengthChartConfig(chartData, '卧推');
      
      config.width = this.cWidth;
      config.height = this.cHeight;
      config.pixelRatio = this.pixelRatio;
      
      initChart('strengthChart', config, this);
    },

    // 初始化训练分布饼图
    initDistributionChart() {
      // 模拟数据
      const mockRecords = [
        { exerciseName: '卧推', sets: 12 },
        { exerciseName: '深蹲', sets: 10 },
        { exerciseName: '硬拉', sets: 8 },
        { exerciseName: '引体向上', sets: 6 },
        { exerciseName: '哑铃弯举', sets: 8 }
      ];

      const chartData = formatDistributionData(mockRecords);
      const config = getTrainingDistributionConfig(chartData);
      
      config.width = this.cWidth;
      config.height = this.cHeight;
      config.pixelRatio = this.pixelRatio;
      
      initChart('distributionChart', config, this);
    },

    // 处理容量图表触摸事件
    touchVolumeChart(e) {
      handleChartTouch('volumeChart', e);
    },

    // 处理力量图表触摸事件
    touchStrengthChart(e) {
      handleChartTouch('strengthChart', e);
    },

    // 处理分布图表触摸事件
    touchDistributionChart(e) {
      handleChartTouch('distributionChart', e);
    },

    // 更新图表数据示例
    updateChartData() {
      const newData = {
        categories: ['1/1', '1/3', '1/5', '1/8', '1/10'],
        series: [{
          name: '训练容量',
          data: [1800, 1860, 2080, 2600, 2800]
        }]
      };
      
      updateChart('volumeChart', newData);
    }
  }
};
</script>

<style scoped>
.charts-container {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.chart-section {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.chart-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 20rpx;
  padding-left: 20rpx;
  border-left: 6rpx solid #4CAF50;
}

.charts-box {
  width: 100%;
  height: 500rpx;
  background-color: #fafafa;
  border-radius: 12rpx;
}

.charts {
  width: 100%;
  height: 100%;
}
</style>
