/**
 * 图表工具类 - 基于 uCharts 封装
 * 用于健身助手的各种图表展示
 */

// 导入 uCharts
import uCharts from '@/static/ucharts/u-charts.min.js';

// 图表实例存储对象
const chartInstances = {};

/**
 * 获取图表默认配置
 * @param {Object} customConfig - 自定义配置
 * @returns {Object} 合并后的配置
 */
function getDefaultConfig(customConfig = {}) {
  const defaultConfig = {
    // 画布背景
    background: '#FFFFFF',
    // 动画效果
    animation: true,
    // 动画时长
    duration: 1000,
    // 内边距 [上, 右, 下, 左]
    padding: [15, 15, 0, 5],
    // 字体大小
    fontSize: 12,
    // 字体颜色
    fontColor: '#666666',
    // 网格线颜色
    gridColor: '#E5E5E5',
    // 图例配置
    legend: {
      show: true,
      position: 'bottom',
      float: 'center',
      padding: 10,
      margin: 10,
      fontSize: 11,
      fontColor: '#666666',
      lineHeight: 18,
      itemGap: 20
    },
    // 提示框配置
    tooltip: {
      show: true,
      showBox: true,
      boxPadding: 8,
      fontSize: 12,
      fontColor: '#FFFFFF',
      bgColor: '#000000',
      bgOpacity: 0.7,
      borderRadius: 4
    },
    // X轴配置
    xAxis: {
      disableGrid: true,
      gridColor: '#E5E5E5',
      fontSize: 11,
      fontColor: '#999999',
      rotateLabel: false,
      rotateAngle: 45
    },
    // Y轴配置
    yAxis: {
      disableGrid: false,
      gridColor: '#E5E5E5',
      gridType: 'dash',
      dashLength: 4,
      fontSize: 11,
      fontColor: '#999999',
      showTitle: false,
      data: [{
        min: 0,
        axisLine: false
      }]
    },
    // 额外配置
    extra: {}
  };

  return deepMerge(defaultConfig, customConfig);
}

/**
 * 深度合并对象
 * @param {Object} target - 目标对象
 * @param {Object} source - 源对象
 * @returns {Object} 合并后的对象
 */
function deepMerge(target, source) {
  const result = { ...target };
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }
  return result;
}

/**
 * 初始化图表
 * @param {String} canvasId - canvas ID
 * @param {Object} config - 图表配置
 * @param {Object} context - 页面上下文 (this)
 * @returns {Object} uCharts 实例
 */
export function initChart(canvasId, config, context) {
  // 获取系统信息计算图表尺寸
  const systemInfo = uni.getSystemInfoSync();
  const pixelRatio = systemInfo.pixelRatio;
  
  // 获取 canvas 上下文
  const ctx = uni.createCanvasContext(canvasId, context);
  
  // 合并配置
  const finalConfig = getDefaultConfig(config);
  
  // 创建图表实例
  const chart = new uCharts({
    ...finalConfig,
    context: ctx,
    canvasId: canvasId,
    pixelRatio: pixelRatio
  });
  
  // 存储实例
  chartInstances[canvasId] = chart;
  
  return chart;
}

/**
 * 获取训练容量趋势图配置
 * @param {Object} data - 图表数据
 * @param {Array} data.categories - X轴分类数据 (日期)
 * @param {Array} data.series - 系列数据
 * @param {String} data.series[].name - 系列名称
 * @param {Array} data.series[].data - 系列数据值
 * @returns {Object} 图表配置
 */
export function getVolumeChartConfig(data) {
  return {
    type: 'line',
    categories: data.categories || [],
    series: data.series || [],
    // 主题色配置 - 健身主题
    color: ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0'],
    // 折线图特有配置
    extra: {
      line: {
        type: 'curve', // 曲线
        width: 3,
        activeType: 'hollow', // 激活点样式
        linearType: 'custom', // 渐变
        onShadow: true, // 阴影
        animation: 'horizontal' // 动画方向
      },
      markLine: {
        show: true,
        data: [{
          value: 0,
          label: '目标线',
          lineColor: '#FF5722',
          showLabel: true
        }]
      }
    },
    // X轴配置
    xAxis: {
      disableGrid: true,
      fontSize: 10,
      fontColor: '#999999',
      rotateLabel: data.categories && data.categories.length > 7, // 数据多的时候旋转标签
      rotateAngle: 45
    },
    // Y轴配置
    yAxis: {
      disableGrid: false,
      gridColor: '#EEEEEE',
      gridType: 'dash',
      fontSize: 10,
      fontColor: '#999999',
      data: [{
        min: 0,
        title: '容量 (kg)',
        titleFontSize: 10,
        titleFontColor: '#666666'
      }]
    },
    // 图例
    legend: {
      show: true,
      position: 'top',
      float: 'right',
      fontSize: 10,
      itemGap: 15
    },
    // 数据点标签
    dataLabel: false,
    // 提示框
    tooltip: {
      show: true,
      showBox: true,
      boxPadding: 6,
      fontSize: 11,
      bgColor: '#000000',
      bgOpacity: 0.7,
      fontColor: '#FFFFFF'
    }
  };
}

/**
 * 获取力量进步曲线配置
 * @param {Object} data - 图表数据
 * @param {Array} data.categories - X轴分类数据 (日期)
 * @param {Array} data.series - 系列数据
 * @param {String} exerciseName - 动作名称 (用于标题)
 * @returns {Object} 图表配置
 */
export function getStrengthChartConfig(data, exerciseName = '力量进步') {
  return {
    type: 'area', // 区域图，更美观
    categories: data.categories || [],
    series: data.series || [],
    // 主题色配置
    color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
    // 区域图特有配置
    extra: {
      area: {
        type: 'curve', // 曲线
        opacity: 0.4, // 区域透明度
        addLine: true, // 显示线条
        width: 3,
        gradient: true // 渐变填充
      },
      markLine: {
        show: false
      }
    },
    // X轴配置
    xAxis: {
      disableGrid: true,
      fontSize: 10,
      fontColor: '#999999',
      rotateLabel: data.categories && data.categories.length > 7,
      rotateAngle: 45
    },
    // Y轴配置
    yAxis: {
      disableGrid: false,
      gridColor: '#EEEEEE',
      gridType: 'dash',
      fontSize: 10,
      fontColor: '#999999',
      data: [{
        min: 0,
        title: '重量 (kg)',
        titleFontSize: 10,
        titleFontColor: '#666666'
      }]
    },
    // 图例
    legend: {
      show: true,
      position: 'top',
      float: 'center',
      fontSize: 10,
      itemGap: 20
    },
    // 数据点
    dataPointShape: true,
    dataPointShapeType: 'hollow',
    // 提示框
    tooltip: {
      show: true,
      showBox: true,
      boxPadding: 6,
      fontSize: 11,
      bgColor: '#000000',
      bgOpacity: 0.7,
      fontColor: '#FFFFFF'
      // 注意：format 函数在 uCharts 中通过其他方式配置
    }
  };
}

/**
 * 获取训练分布饼图配置
 * @param {Object} data - 图表数据
 * @param {Array} data.series - 系列数据
 * @returns {Object} 图表配置
 */
export function getTrainingDistributionConfig(data) {
  return {
    type: 'pie',
    series: data.series || [],
    // 主题色配置
    color: ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336', '#00BCD4', '#8BC34A', '#FFEB3B'],
    // 饼图特有配置
    extra: {
      pie: {
        activeOpacity: 0.8,
        activeRadius: 10,
        offsetAngle: 0,
        labelWidth: 15,
        border: true,
        borderWidth: 2,
        borderColor: '#FFFFFF'
      }
    },
    // 数据标签
    dataLabel: true,
    // 图例
    legend: {
      show: true,
      position: 'bottom',
      float: 'center',
      fontSize: 10,
      itemGap: 15,
      lineHeight: 16
    },
    // 提示框
    tooltip: {
      show: true,
      showBox: true,
      boxPadding: 6,
      fontSize: 11,
      bgColor: '#000000',
      bgOpacity: 0.7,
      fontColor: '#FFFFFF'
    }
  };
}

/**
 * 获取柱状图配置 (用于对比数据)
 * @param {Object} data - 图表数据
 * @param {Array} data.categories - X轴分类
 * @param {Array} data.series - 系列数据
 * @returns {Object} 图表配置
 */
export function getColumnChartConfig(data) {
  return {
    type: 'column',
    categories: data.categories || [],
    series: data.series || [],
    // 主题色配置
    color: ['#4CAF50', '#2196F3', '#FF9800'],
    // 柱状图特有配置
    extra: {
      column: {
        type: 'group', // 分组柱状图
        width: 20,
        activeBgColor: '#000000',
        activeBgOpacity: 0.08
      }
    },
    // X轴配置
    xAxis: {
      disableGrid: true,
      fontSize: 10,
      fontColor: '#999999'
    },
    // Y轴配置
    yAxis: {
      disableGrid: false,
      gridColor: '#EEEEEE',
      gridType: 'dash',
      fontSize: 10,
      fontColor: '#999999',
      data: [{
        min: 0,
        axisLine: false
      }]
    },
    // 图例
    legend: {
      show: true,
      position: 'top',
      float: 'right',
      fontSize: 10,
      itemGap: 15
    },
    // 数据标签
    dataLabel: false
  };
}

/**
 * 更新图表数据
 * @param {String} canvasId - canvas ID
 * @param {Object} data - 新数据
 * @param {Object} opts - 更新选项
 * @returns {Boolean} 是否更新成功
 */
export function updateChart(canvasId, data, opts = {}) {
  const chart = chartInstances[canvasId];
  if (!chart) {
    console.warn(`[charts.js] 图表实例不存在: ${canvasId}`);
    return false;
  }

  try {
    // 更新数据
    chart.updateData({
      categories: data.categories,
      series: data.series,
      ...opts
    });
    return true;
  } catch (error) {
    console.error(`[charts.js] 更新图表失败: ${canvasId}`, error);
    return false;
  }
}

/**
 * 销毁图表实例
 * @param {String} canvasId - canvas ID
 */
export function destroyChart(canvasId) {
  const chart = chartInstances[canvasId];
  if (chart) {
    // 清理图表资源
    if (chart.stopAnimation) {
      chart.stopAnimation();
    }
    delete chartInstances[canvasId];
  }
}

/**
 * 销毁所有图表实例
 */
export function destroyAllCharts() {
  Object.keys(chartInstances).forEach(canvasId => {
    destroyChart(canvasId);
  });
}

/**
 * 处理图表触摸事件 (显示 tooltip)
 * @param {String} canvasId - canvas ID
 * @param {Object} e - 触摸事件对象
 */
export function handleChartTouch(canvasId, e) {
  const chart = chartInstances[canvasId];
  if (chart && chart.showTooltip) {
    chart.showTooltip(e);
  } else if (chart && chart.showToolTip) {
    // 兼容旧版本 uCharts
    chart.showToolTip(e);
  }
}

/**
 * 处理图表点击事件
 * @param {String} canvasId - canvas ID
 * @param {Object} e - 点击事件对象
 * @param {Function} callback - 点击回调函数
 */
export function handleChartClick(canvasId, e, callback) {
  const chart = chartInstances[canvasId];
  if (chart) {
    // 获取点击的数据项
    const index = chart.getCurrentDataIndex(e);
    if (index !== undefined && index !== null && callback) {
      callback(index, chart);
    }
  }
}

/**
 * 获取图表实例
 * @param {String} canvasId - canvas ID
 * @returns {Object|null} 图表实例
 */
export function getChartInstance(canvasId) {
  return chartInstances[canvasId] || null;
}

/**
 * 保存图表为图片
 * @param {String} canvasId - canvas ID
 * @param {Object} opts - 保存选项
 * @returns {Promise} 图片路径
 */
export function saveChartAsImage(canvasId, opts = {}) {
  return new Promise((resolve, reject) => {
    const defaultOpts = {
      x: 0,
      y: 0,
      width: 375,
      height: 250,
      destWidth: 750,
      destHeight: 500,
      fileType: 'png',
      quality: 1,
      ...opts
    };

    uni.canvasToTempFilePath({
      canvasId: canvasId,
      ...defaultOpts,
      success: (res) => {
        resolve(res.tempFilePath);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

/**
 * 格式化训练容量数据为图表可用格式
 * @param {Array} records - 训练记录数组
 * @returns {Object} 格式化后的数据
 */
export function formatVolumeData(records) {
  if (!records || records.length === 0) {
    return {
      categories: [],
      series: []
    };
  }

  // 按日期分组统计容量
  const volumeByDate = {};
  records.forEach(record => {
    const date = record.date || record.createTime;
    if (!volumeByDate[date]) {
      volumeByDate[date] = 0;
    }
    // 计算单次训练容量: 重量 * 次数 * 组数
    const volume = (record.weight || 0) * (record.reps || 0) * (record.sets || 1);
    volumeByDate[date] += volume;
  });

  // 排序日期
  const sortedDates = Object.keys(volumeByDate).sort();
  
  return {
    categories: sortedDates.map(date => {
      // 格式化日期显示 (MM-DD)
      const d = new Date(date);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    }),
    series: [{
      name: '训练容量',
      data: sortedDates.map(date => volumeByDate[date])
    }]
  };
}

/**
 * 格式化力量进步数据为图表可用格式
 * @param {Array} records - 训练记录数组
 * @param {String} exerciseId - 动作ID (可选，不传则统计所有)
 * @returns {Object} 格式化后的数据
 */
export function formatStrengthData(records, exerciseId = null) {
  if (!records || records.length === 0) {
    return {
      categories: [],
      series: []
    };
  }

  // 筛选特定动作的记录
  let filteredRecords = records;
  if (exerciseId) {
    filteredRecords = records.filter(r => r.exerciseId === exerciseId);
  }

  // 按日期分组取最大重量
  const weightByDate = {};
  filteredRecords.forEach(record => {
    const date = record.date || record.createTime;
    if (!weightByDate[date]) {
      weightByDate[date] = 0;
    }
    // 取当天最大重量
    weightByDate[date] = Math.max(weightByDate[date], record.weight || 0);
  });

  // 排序日期
  const sortedDates = Object.keys(weightByDate).sort();
  
  return {
    categories: sortedDates.map(date => {
      const d = new Date(date);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    }),
    series: [{
      name: '最大重量',
      data: sortedDates.map(date => weightByDate[date])
    }]
  };
}

/**
 * 格式化训练分布数据为饼图可用格式
 * @param {Array} records - 训练记录数组
 * @returns {Object} 格式化后的数据
 */
export function formatDistributionData(records) {
  if (!records || records.length === 0) {
    return {
      series: []
    };
  }

  // 按动作分组统计次数
  const countByExercise = {};
  records.forEach(record => {
    const name = record.exerciseName || record.name || '未知动作';
    if (!countByExercise[name]) {
      countByExercise[name] = 0;
    }
    countByExercise[name] += record.sets || 1;
  });

  // 转换为饼图数据格式
  const series = Object.keys(countByExercise).map(name => ({
    name: name,
    value: countByExercise[name]
  }));

  // 按数值排序，取前8个
  series.sort((a, b) => b.value - a.value);
  const topSeries = series.slice(0, 8);
  
  return {
    series: topSeries
  };
}

// 默认导出
export default {
  initChart,
  getVolumeChartConfig,
  getStrengthChartConfig,
  getTrainingDistributionConfig,
  getColumnChartConfig,
  updateChart,
  destroyChart,
  destroyAllCharts,
  handleChartTouch,
  handleChartClick,
  getChartInstance,
  saveChartAsImage,
  formatVolumeData,
  formatStrengthData,
  formatDistributionData
};
