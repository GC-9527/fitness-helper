// 批量更新动作库视频链接脚本
// 功能：
// 1. 将占位链接替换为抖音搜索链接
// 2. 支持自定义特定动作的链接
// 3. 支持批量替换所有动作为指定链接格式
// 4. 支持恢复默认占位链接

const fs = require('fs');
const path = require('path');

// 配置文件路径
const filePath = path.join(__dirname, 'utils', 'exerciseDatabase.js');

// 读取文件
function readDatabase() {
  return fs.readFileSync(filePath, 'utf8');
}

// 保存文件
function saveDatabase(content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

// 动作名称到搜索关键词的映射（用于生成抖音搜索链接）
const actionSearchMap = {
  'incline_dumbbell_press': '上斜哑铃卧推教学',
  'decline_barbell_press': '下斜杠铃卧推教学',
  'machine_chest_press': '器械推胸教学',
  'cable_crossover': '龙门架夹胸教学',
  'svend_press': '斯旺德推胸教学',
  'landmine_press_chest': '地雷管推胸教学',
  'close_grip_bench_press': '窄距卧推教学',
  'incline_dumbbell_fly': '上斜哑铃飞鸟教学',
  'cable_crossover_low': '低位绳索夹胸教学',
  'barbell_row': '杠铃划船教学',
  'seated_cable_row': '坐姿绳索划船教学',
  't_bar_row': 'T杠划船教学',
  'chin_up': '反握引体向上教学',
  'straight_arm_pulldown': '直臂下压教学',
  'cable_face_pull': '绳索面拉教学',
  'hyperextension': '山羊挺身教学',
  'pendlay_row': '潘德雷划船教学',
  'chest_supported_row': '胸部支撑划船教学',
  'inverted_row': '反向划船教学',
  'machine_row': '器械划船教学',
  'dumbbell_pullover': '哑铃上拉教学',
  'walking_lunge': '行走箭步蹲教学',
  'leg_extension': '腿屈伸教学',
  'leg_curl': '腿弯举教学',
  'bulgarian_split_squat': '保加利亚分腿蹲教学',
  'goblet_squat': '高脚杯深蹲教学',
  'hack_squat': '哈克深蹲教学',
  'front_squat': '颈前深蹲教学',
  'stiff_leg_deadlift': '直腿硬拉教学',
  'step_up': '登阶教学',
  'calf_raise': '提踵教学',
  'seated_leg_curl': '坐姿腿弯举教学',
  'sumo_deadlift': '相扑硬拉教学',
  'sissy_squat': '西斯深蹲教学',
  'good_morning': '早安式教学',
  'dumbbell_shoulder_press': '哑铃推举教学',
  'front_raise': '前平举教学',
  'rear_delt_fly': '俯身飞鸟教学',
  'upright_row': '直立划船教学',
  'arnold_press': '阿诺德推举教学',
  'machine_shoulder_press': '器械推举教学',
  'cable_lateral_raise': '绳索侧平举教学',
  'reverse_pec_deck': '反向蝴蝶机教学',
  'push_press': '借力推举教学',
  'face_pull_shoulders': '面拉教学',
  'dumbbell_shrug': '哑铃耸肩教学',
  'cable_front_raise': '绳索前平举教学',
  'around_the_world': '环绕世界教学',
  'cuban_press': '古巴推举教学',
  'hammer_curl': '锤式弯举教学',
  'skull_crusher': '碎颅者教学',
  'preacher_curl': '牧师凳弯举教学',
  'overhead_tricep_extension': '颈后臂屈伸教学',
  'concentration_curl': '集中弯举教学',
  'cable_curl': '绳索弯举教学',
  'diamond_push_up': '钻石俯卧撑教学',
  'incline_dumbbell_curl': '上斜哑铃弯举教学',
  'rope_pushdown': '绳索下压教学',
  'zottman_curl': '佐特曼弯举教学',
  'bench_dips': '凳上臂屈伸教学',
  'spider_curl': '蜘蛛弯举教学',
  'close_grip_bench_press_arms': '窄距卧推教学',
  'drag_curl': '拖拽弯举教学',
  'russian_twist': '俄罗斯转体教学',
  'leg_raise': '举腿教学',
  'mountain_climber': '登山者教学',
  'dead_bug': '死虫式教学',
  'side_plank': '侧平板支撑教学',
  'hanging_leg_raise': '悬垂举腿教学',
  'ab_wheel_rollout': '健腹轮教学',
  'bicycle_crunch': '自行车卷腹教学',
  'wood_chop': '伐木式教学',
  'pallof_press': '帕洛夫推举教学',
  'dragon_flag': '龙旗教学',
  'hollow_body_hold': '空心体保持教学',
  'reverse_crunch': '反向卷腹教学',
  'flutter_kick': '交替打腿教学',
  'bird_dog': '鸟狗式教学'
};

// 热门动作的特定视频链接（已验证的真实链接）
const popularActionLinks = {
  'barbell_bench_press': 'https://jingxuan.douyin.com/m/video/7424522714360073508',
  'dumbbell_bench_press': 'https://m.douyin.com/shipin/7359452462065764404',
  'squat': 'https://jingxuan.douyin.com/m/video/7498954440176471356',
  'deadlift': 'https://jingxuan.douyin.com/m/video/7492320260381576488',
  'romanian_deadlift': 'https://m.douyin.com/share/video/7144188957696331038',
  'romanian_deadlift_legs': 'https://jingxuan.douyin.com/m/video/7489809147660143930',
  'lateral_raise': 'https://m.douyin.com/zhuanti/7382806022101960743',
  'crunch': 'https://www.douyin.com/zhuanti/7440709573649958952'
};

// 功能1：更新所有占位链接为抖音搜索链接
function updateAllToSearchLinks() {
  let content = readDatabase();
  let updatedCount = 0;

  for (const [id, searchTerm] of Object.entries(actionSearchMap)) {
    const searchPattern = `id: "${id}"`;
    const oldUrlPattern = 'https://www.douyin.com/video/';

    const idIndex = content.indexOf(searchPattern);
    if (idIndex !== -1) {
      const videoUrlStart = content.indexOf('videoUrl: "', idIndex);
      if (videoUrlStart !== -1) {
        const videoUrlEnd = content.indexOf('"', videoUrlStart + 11);
        const currentUrl = content.substring(videoUrlStart + 11, videoUrlEnd);

        if (currentUrl.includes(oldUrlPattern)) {
          const newUrl = `https://www.douyin.com/search/${encodeURIComponent(searchTerm)}`;
          content = content.substring(0, videoUrlStart + 11) + newUrl + content.substring(videoUrlEnd);
          updatedCount++;
          console.log(`✓ 更新: ${id} -> ${searchTerm}`);
        }
      }
    }
  }

  saveDatabase(content);
  console.log(`\n========================`);
  console.log(`更新完成！共更新 ${updatedCount} 个动作`);
  console.log(`========================`);
  return updatedCount;
}

// 功能2：更新热门动作为特定视频链接
function updatePopularActions() {
  let content = readDatabase();
  let updatedCount = 0;

  for (const [id, videoUrl] of Object.entries(popularActionLinks)) {
    const searchPattern = `id: "${id}"`;

    const idIndex = content.indexOf(searchPattern);
    if (idIndex !== -1) {
      const videoUrlStart = content.indexOf('videoUrl: "', idIndex);
      if (videoUrlStart !== -1) {
        const videoUrlEnd = content.indexOf('"', videoUrlStart + 11);
        const currentUrl = content.substring(videoUrlStart + 11, videoUrlEnd);

        if (currentUrl !== videoUrl) {
          content = content.substring(0, videoUrlStart + 11) + videoUrl + content.substring(videoUrlEnd);
          updatedCount++;
          console.log(`✓ 更新热门动作: ${id}`);
        }
      }
    }
  }

  saveDatabase(content);
  console.log(`\n========================`);
  console.log(`热门动作更新完成！共更新 ${updatedCount} 个动作`);
  console.log(`========================`);
  return updatedCount;
}

// 功能3：为指定动作设置自定义链接
function setCustomLink(actionId, videoUrl) {
  let content = readDatabase();
  const searchPattern = `id: "${actionId}"`;

  const idIndex = content.indexOf(searchPattern);
  if (idIndex === -1) {
    console.log(`✗ 未找到动作: ${actionId}`);
    return false;
  }

  const videoUrlStart = content.indexOf('videoUrl: "', idIndex);
  if (videoUrlStart === -1) {
    console.log(`✗ 未找到视频链接字段: ${actionId}`);
    return false;
  }

  const videoUrlEnd = content.indexOf('"', videoUrlStart + 11);
  const oldUrl = content.substring(videoUrlStart + 11, videoUrlEnd);

  content = content.substring(0, videoUrlStart + 11) + videoUrl + content.substring(videoUrlEnd);
  saveDatabase(content);

  console.log(`✓ 已更新: ${actionId}`);
  console.log(`  旧链接: ${oldUrl}`);
  console.log(`  新链接: ${videoUrl}`);
  return true;
}

// 功能4：统计当前链接状态
function statsLinks() {
  let content = readDatabase();

  // 匹配所有 videoUrl
  const videoUrlRegex = /videoUrl: "([^"]+)"/g;
  let match;
  let total = 0;
  let placeholderCount = 0;
  let searchLinkCount = 0;
  let specificLinkCount = 0;

  while ((match = videoUrlRegex.exec(content)) !== null) {
    total++;
    const url = match[1];
    if (url.includes('douyin.com/video/')) {
      placeholderCount++;
    } else if (url.includes('douyin.com/search/')) {
      searchLinkCount++;
    } else {
      specificLinkCount++;
    }
  }

  console.log('\n========== 链接统计 ==========');
  console.log(`总动作数: ${total}`);
  console.log(`占位链接: ${placeholderCount}`);
  console.log(`搜索链接: ${searchLinkCount}`);
  console.log(`特定链接: ${specificLinkCount}`);
  console.log('==============================\n');

  return { total, placeholderCount, searchLinkCount, specificLinkCount };
}

// 主函数
function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'search':
      // 更新所有占位链接为搜索链接
      console.log('开始更新所有占位链接为抖音搜索链接...\n');
      updateAllToSearchLinks();
      break;

    case 'popular':
      // 更新热门动作为特定链接
      console.log('开始更新热门动作链接...\n');
      updatePopularActions();
      break;

    case 'custom':
      // 设置自定义链接
      // 用法: node update_video_links.js custom <actionId> <videoUrl>
      if (args.length < 3) {
        console.log('用法: node update_video_links.js custom <actionId> <videoUrl>');
        console.log('示例: node update_video_links.js custom barbell_bench_press https://www.douyin.com/video/xxx');
        return;
      }
      setCustomLink(args[1], args[2]);
      break;

    case 'stats':
      // 统计链接状态
      statsLinks();
      break;

    case 'all':
      // 执行所有更新操作
      console.log('开始执行完整更新流程...\n');
      console.log('步骤1: 更新热门动作链接');
      updatePopularActions();
      console.log('\n步骤2: 更新其他动作为搜索链接');
      updateAllToSearchLinks();
      console.log('\n步骤3: 统计链接状态');
      statsLinks();
      break;

    default:
      console.log('\n========== 视频链接更新工具 ==========');
      console.log('用法: node update_video_links.js <command>');
      console.log('\n可用命令:');
      console.log('  search   - 更新所有占位链接为抖音搜索链接');
      console.log('  popular  - 更新热门动作为特定视频链接');
      console.log('  custom   - 为指定动作设置自定义链接');
      console.log('  stats    - 统计当前链接状态');
      console.log('  all      - 执行完整更新流程（推荐）');
      console.log('\n示例:');
      console.log('  node update_video_links.js all');
      console.log('  node update_video_links.js custom squat https://www.douyin.com/video/xxx');
      console.log('=====================================\n');
  }
}

// 执行主函数
main();
