// 健身动作数据库
// 包含6大肌群：胸部、背部、腿部、肩部、手臂、核心

const exerciseDatabase = {
  // ========== 胸部肌群 ==========
  chest: [
    {
      id: "barbell_bench_press",
      name: "杠铃卧推",
      part: "胸部",
      equipment: "杠铃",
      difficulty: "中级",
      videoUrl: "https://jingxuan.douyin.com/m/video/7424522714360073508",
      instructions: [
        "平躺在卧推凳上，双脚平放地面，臀部和肩部紧贴凳面",
        "双手握杠铃，握距略宽于肩宽，手腕保持中立位",
        "吸气，控制杠铃缓慢下降至胸部中下方位置",
        "呼气，用胸部力量将杠铃推起至手臂伸直但不锁死",
        "全程保持核心收紧，肩胛骨下沉后收",
        "推起时杠铃轨迹略微向上倾斜"
      ],
      commonMistakes: [
        "肘部过度外展，导致肩部压力过大",
        "杠铃下降位置过高，增加肩关节受伤风险",
        "腰部拱起过高，失去核心稳定性"
      ],
      alternatives: ["dumbbell_bench_press", "machine_chest_press", "push_up"]
    },
    {
      id: "dumbbell_bench_press",
      name: "哑铃卧推",
      part: "胸部",
      equipment: "哑铃",
      difficulty: "中级",
      videoUrl: "https://m.douyin.com/shipin/7359452462065764404",
      instructions: [
        "平躺在卧推凳上，双手各持一只哑铃置于大腿上",
        "用膝盖辅助将哑铃推起至胸部两侧，掌心朝前",
        "吸气，控制哑铃缓慢下降至胸部两侧，肘部略低于身体",
        "呼气，用胸部力量将哑铃推起至手臂伸直",
        "推至顶端时哑铃可以轻微内收，增加胸部挤压感",
        "动作过程中保持肩胛骨稳定下沉"
      ],
      commonMistakes: [
        "哑铃下降过快，失去控制",
        "肘部过度外展，增加肩部压力",
        "推起时耸肩，导致上斜方肌代偿"
      ],
      alternatives: ["barbell_bench_press", "cable_fly", "push_up"]
    },
    {
      id: "incline_barbell_press",
      name: "上斜杠铃卧推",
      part: "胸部",
      equipment: "杠铃",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E4%B8%8A%E6%96%9C%E6%9D%A0%E9%93%83%E5%8D%A7%E6%8E%A8%E6%95%99%E5%AD%A6",
      instructions: [
        "将卧推凳调整至30-45度上斜角度",
        "坐于凳上，双脚平放地面，背部紧贴凳面",
        "双手握杠铃，握距略宽于肩宽",
        "吸气，控制杠铃下降至锁骨下方位置",
        "呼气，用胸部力量将杠铃推起至手臂伸直",
        "重点感受上胸肌群的收缩发力"
      ],
      commonMistakes: [
        "凳子角度过高（超过45度），变成肩部训练",
        "杠铃下降位置过低，增加肩关节压力",
        "推起时腰部过度拱起"
      ],
      alternatives: ["incline_dumbbell_press", "machine_incline_press", "landmine_press"]
    },
    {
      id: "incline_dumbbell_press",
      name: "上斜哑铃卧推",
      part: "胸部",
      equipment: "哑铃",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E4%B8%8A%E6%96%9C%E5%93%91%E9%93%83%E5%8D%A7%E6%8E%A8%E6%95%99%E5%AD%A6",
      instructions: [
        "将卧推凳调整至30-45度上斜角度",
        "双手各持哑铃坐于凳上，将哑铃推起至胸部两侧",
        "吸气，控制哑铃缓慢下降至胸部两侧",
        "呼气，用上胸力量将哑铃推起",
        "推至顶端时哑铃轻微内收",
        "全程保持核心收紧，肩胛骨稳定"
      ],
      commonMistakes: [
        "哑铃轨迹不稳定，左右晃动",
        "推起时耸肩借力",
        "下降幅度不足，影响训练效果"
      ],
      alternatives: ["incline_barbell_press", "dumbbell_fly", "cable_crossover"]
    },
    {
      id: "dumbbell_fly",
      name: "哑铃飞鸟",
      part: "胸部",
      equipment: "哑铃",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E5%93%91%E9%93%83%E9%A3%9E%E9%B8%9F%E6%95%99%E5%AD%A6",
      instructions: [
        "平躺在卧推凳上，双手各持哑铃举于胸部上方",
        "手肘微屈，掌心相对，哑铃间距与肩同宽",
        "吸气，控制哑铃向两侧展开，感受胸部拉伸",
        "展开至大臂与地面平行或略低",
        "呼气，用胸部力量将哑铃环抱回起始位置",
        "动作过程中保持手肘角度不变"
      ],
      commonMistakes: [
        "手肘过度弯曲，变成推举动作",
        "展开幅度过大，超过身体承受范围",
        "动作速度过快，失去肌肉控制"
      ],
      alternatives: ["cable_fly", "pec_deck_fly", "incline_dumbbell_fly"]
    },
    {
      id: "cable_fly",
      name: "绳索夹胸",
      part: "胸部",
      equipment: "绳索",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E7%BB%B3%E7%B4%A2%E5%A4%B9%E8%83%B8%E6%95%99%E5%AD%A6",
      instructions: [
        "将滑轮调至高位，双手握住绳索把手",
        "站在龙门架中间，一脚前一脚后站稳",
        "手肘微屈，身体略微前倾",
        "吸气，控制双臂向两侧展开，感受胸部拉伸",
        "呼气，用胸部力量将绳索向前下方环抱",
        "双手交叉于身体前方，挤压胸部肌肉"
      ],
      commonMistakes: [
        "手肘过度弯曲，失去孤立训练效果",
        "身体晃动借力",
        "绳索回位时失去控制，速度过快"
      ],
      alternatives: ["dumbbell_fly", "pec_deck_fly", "cable_crossover"]
    },
    {
      id: "push_up",
      name: "俯卧撑",
      part: "胸部",
      equipment: "自重",
      difficulty: "初级",
      videoUrl: "https://www.douyin.com/search/%E4%BF%AF%E5%8D%A7%E6%92%91%E6%95%99%E5%AD%A6",
      instructions: [
        "双手撑地，间距略宽于肩宽，手臂伸直",
        "身体呈一条直线，从头到脚跟保持直线",
        "核心收紧，臀部不要塌陷或翘起",
        "吸气，控制身体下降至胸部接近地面",
        "呼气，用胸部和手臂力量将身体推起",
        "推起时手臂伸直但不锁死肘关节"
      ],
      commonMistakes: [
        "臀部塌陷或过度翘起，身体不成直线",
        "手肘过度外展，增加肩部压力",
        "下降幅度不足，胸部未接近地面"
      ],
      alternatives: ["knee_push_up", "diamond_push_up", "decline_push_up"]
    },
    {
      id: "pec_deck_fly",
      name: "蝴蝶机夹胸",
      part: "胸部",
      equipment: "器械",
      difficulty: "初级",
      videoUrl: "https://www.douyin.com/search/%E8%9D%B4%E8%9D%B6%E6%9C%BA%E5%A4%B9%E8%83%B8%E6%95%99%E5%AD%A6",
      instructions: [
        "坐在蝴蝶机上，背部紧贴靠背",
        "调整座椅高度，使把手与胸部平齐",
        "双手握住把手，手肘微屈",
        "吸气，控制双臂向两侧展开，感受胸部拉伸",
        "展开至大臂与地面平行",
        "呼气，用胸部力量将把手环抱至胸前"
      ],
      commonMistakes: [
        "手肘过度伸直，增加关节压力",
        "耸肩借力",
        "动作速度过快，失去肌肉控制"
      ],
      alternatives: ["cable_fly", "dumbbell_fly", "machine_chest_press"]
    },
    {
      id: "decline_barbell_press",
      name: "下斜杠铃卧推",
      part: "胸部",
      equipment: "杠铃",
      difficulty: "高级",
      videoUrl: "https://www.douyin.com/search/%E4%B8%8B%E6%96%9C%E6%9D%A0%E9%93%83%E5%8D%A7%E6%8E%A8%E6%95%99%E5%AD%A6",
      instructions: [
        "将卧推凳调整至下斜角度（15-30度）",
        "躺于凳上，双脚固定在下斜凳的脚托中",
        "双手握杠铃，握距略宽于肩宽",
        "吸气，控制杠铃下降至下胸部位置",
        "呼气，用胸部力量将杠铃推起",
        "重点感受下胸肌群的收缩发力"
      ],
      commonMistakes: [
        "下斜角度过大，导致头部充血不适",
        "杠铃下降位置过高",
        "推起时失去控制，速度过快"
      ],
      alternatives: ["decline_dumbbell_press", "dips", "cable_crossover_low"]
    },
    {
      id: "dips",
      name: "双杠臂屈伸",
      part: "胸部",
      equipment: "自重",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E5%8F%8C%E6%9D%A0%E8%87%82%E5%B1%88%E4%BC%B8%E6%95%99%E5%AD%A6",
      instructions: [
        "双手握住双杠，手臂伸直支撑身体",
        "身体略微前倾，重心前移",
        "吸气，控制身体下降至大臂与地面平行",
        "下降时手肘向两侧打开",
        "呼气，用胸部和手臂力量将身体推起",
        "推起至手臂伸直但不锁死"
      ],
      commonMistakes: [
        "身体过于直立，变成三头肌训练",
        "下降幅度不足",
        "耸肩借力"
      ],
      alternatives: ["assisted_dips", "bench_dips", "cable_crossover_low"]
    },
    {
      id: "machine_chest_press",
      name: "器械推胸",
      part: "胸部",
      equipment: "器械",
      difficulty: "初级",
      videoUrl: "https://www.douyin.com/search/%E5%99%A8%E6%A2%B0%E6%8E%A8%E8%83%B8%E6%95%99%E5%AD%A6",
      instructions: [
        "坐在器械上，调整座椅高度使把手与胸部平齐",
        "背部紧贴靠背，双脚平放地面",
        "双手握住把手，手肘向两侧打开",
        "吸气，控制把手向胸部方向回拉",
        "呼气，用胸部力量将把手向前推起",
        "推至手臂伸直但不锁死"
      ],
      commonMistakes: [
        "座椅高度不合适，导致发力位置错误",
        "推起时耸肩",
        "动作速度过快"
      ],
      alternatives: ["barbell_bench_press", "dumbbell_bench_press", "push_up"]
    },
    {
      id: "cable_crossover",
      name: "龙门架夹胸",
      part: "胸部",
      equipment: "绳索",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E9%BE%99%E9%97%A8%E6%9E%B6%E5%A4%B9%E8%83%B8%E6%95%99%E5%AD%A6",
      instructions: [
        "将两侧滑轮调至高位，双手握住绳索把手",
        "站在龙门架中间，身体略微前倾",
        "手肘微屈，双臂向两侧展开",
        "吸气，感受胸部拉伸",
        "呼气，用胸部力量将绳索向下前方环抱",
        "双手交叉于身体前方，挤压胸部"
      ],
      commonMistakes: [
        "身体过度前倾或后仰",
        "手肘角度变化过大",
        "动作过程中耸肩"
      ],
      alternatives: ["cable_fly", "dumbbell_fly", "pec_deck_fly"]
    },
    {
      id: "svend_press",
      name: "斯旺德推胸",
      part: "胸部",
      equipment: "哑铃",
      difficulty: "初级",
      videoUrl: "https://www.douyin.com/search/%E6%96%AF%E6%97%BA%E5%BE%B7%E6%8E%A8%E8%83%B8%E6%95%99%E5%AD%A6",
      instructions: [
        "双手各持一个哑铃片或哑铃，置于胸部前方",
        "双手用力挤压哑铃，保持持续张力",
        "手臂向前推出，感受胸部收缩",
        "控制缓慢回收到胸部",
        "全程保持对哑铃的挤压",
        "重复进行推收动作"
      ],
      commonMistakes: [
        "失去对哑铃的挤压",
        "动作速度过快",
        "耸肩借力"
      ],
      alternatives: ["pec_deck_fly", "cable_fly", "dumbbell_fly"]
    },
    {
      id: "landmine_press",
      name: "地雷管推胸",
      part: "胸部",
      equipment: "杠铃",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E5%9C%B0%E9%9B%B7%E7%AE%A1%E6%8E%A8%E8%83%B8%E6%95%99%E5%AD%A6",
      instructions: [
        "将杠铃一端固定于地雷管底座或墙角",
        "双手握住杠铃另一端，置于胸部前方",
        "双脚前后开立，身体略微前倾",
        "吸气，控制杠铃下降至胸部",
        "呼气，用胸部力量将杠铃向前上方推起",
        "推起时感受上胸收缩"
      ],
      commonMistakes: [
        "身体过度后仰",
        "推起时耸肩",
        "杠铃轨迹不稳定"
      ],
      alternatives: ["incline_barbell_press", "incline_dumbbell_press", "machine_incline_press"]
    },
    {
      id: "close_grip_bench_press",
      name: "窄距卧推",
      part: "胸部",
      equipment: "杠铃",
      difficulty: "高级",
      videoUrl: "https://www.douyin.com/search/%E7%AA%84%E8%B7%9D%E5%8D%A7%E6%8E%A8%E6%95%99%E5%AD%A6",
      instructions: [
        "平躺在卧推凳上，双手握杠铃，握距与肩同宽或略窄",
        "双脚平放地面，核心收紧",
        "吸气，控制杠铃下降至胸部中下部",
        "下降时手肘贴近身体两侧",
        "呼气，用胸部和三头肌力量将杠铃推起",
        "重点感受中缝区域的收缩"
      ],
      commonMistakes: [
        "握距过窄，增加手腕压力",
        "手肘过度外展",
        "推起时失去控制"
      ],
      alternatives: ["diamond_push_up", "cable_crossover", "svend_press"]
    },
    {
      id: "incline_dumbbell_fly",
      name: "上斜哑铃飞鸟",
      part: "胸部",
      equipment: "哑铃",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E4%B8%8A%E6%96%9C%E5%93%91%E9%93%83%E9%A3%9E%E9%B8%9F%E6%95%99%E5%AD%A6",
      instructions: [
        "将卧推凳调整至30-45度上斜角度",
        "双手各持哑铃举于上胸部上方",
        "手肘微屈，掌心相对",
        "吸气，控制哑铃向两侧展开",
        "展开至大臂与地面平行",
        "呼气，用上胸力量将哑铃环抱回起始位置"
      ],
      commonMistakes: [
        "手肘角度变化过大",
        "展开幅度过大",
        "耸肩借力"
      ],
      alternatives: ["cable_fly", "dumbbell_fly", "pec_deck_fly"]
    },
    {
      id: "cable_crossover_low",
      name: "低位绳索夹胸",
      part: "胸部",
      equipment: "绳索",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E4%BD%8E%E4%BD%8D%E7%BB%B3%E7%B4%A2%E5%A4%B9%E8%83%B8%E6%95%99%E5%AD%A6",
      instructions: [
        "将两侧滑轮调至低位，双手握住绳索把手",
        "站在龙门架中间，身体略微前倾",
        "手肘微屈，双臂从下方展开",
        "吸气，感受下胸部拉伸",
        "呼气，用下胸力量将绳索向上前方环抱",
        "双手交叉于身体前方"
      ],
      commonMistakes: [
        "身体过度后仰",
        "手肘过度弯曲",
        "耸肩借力"
      ],
      alternatives: ["decline_dumbbell_fly", "dips", "cable_crossover"]
    }
  ],

  // ========== 背部肌群 ==========
  back: [
    {
      id: "deadlift",
      name: "硬拉",
      part: "背部",
      equipment: "杠铃",
      difficulty: "高级",
      videoUrl: "https://jingxuan.douyin.com/m/video/7492320260381576488",
      instructions: [
        "双脚与肩同宽站立，杠铃贴近小腿前侧",
        "屈髋屈膝下蹲，双手正握或正反握杠铃",
        "背部挺直，核心收紧，肩胛骨下沉后收",
        "吸气，伸髋伸膝将杠铃拉起，贴近身体上升",
        "站直时身体挺直，臀部收紧，不要过度后仰",
        "呼气，控制杠铃沿原路径下放至地面"
      ],
      commonMistakes: [
        "背部拱起，增加腰椎受伤风险",
        "杠铃远离身体，增加下背部压力",
        "站直时过度后仰"
      ],
      alternatives: ["romanian_deadlift", "sumo_deadlift", "trap_bar_deadlift"]
    },
    {
      id: "pull_up",
      name: "引体向上",
      part: "背部",
      equipment: "自重",
      difficulty: "高级",
      videoUrl: "https://www.douyin.com/search/%E5%BC%95%E4%BD%93%E5%90%91%E4%B8%8A%E6%95%99%E5%AD%A6",
      instructions: [
        "双手正握单杠，握距略宽于肩宽",
        "身体自然悬垂，核心收紧，双腿可交叉或伸直",
        "吸气，用背部力量将身体向上拉起",
        "拉起至下巴超过单杠或胸部接近单杠",
        "呼气，控制身体缓慢下降至手臂伸直",
        "全程保持身体稳定，不要摆动借力"
      ],
      commonMistakes: [
        "借助身体摆动完成动作",
        "下降时速度过快，失去控制",
        "拉起时耸肩，未充分使用背部肌肉"
      ],
      alternatives: ["lat_pulldown", "assisted_pull_up", "chin_up"]
    },
    {
      id: "barbell_row",
      name: "杠铃划船",
      part: "背部",
      equipment: "杠铃",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E6%9D%A0%E9%93%83%E5%88%92%E8%88%B9%E6%95%99%E5%AD%A6",
      instructions: [
        "双脚与肩同宽站立，杠铃置于身前",
        "屈髋屈膝，身体前倾约45度，背部挺直",
        "双手正握杠铃，握距略宽于肩宽",
        "吸气，将杠铃拉向腹部下胸部位置",
        "拉起时手肘贴近身体，肩胛骨后收",
        "呼气，控制杠铃下放至手臂伸直"
      ],
      commonMistakes: [
        "身体过度直立，减少背部刺激",
        "背部拱起，增加受伤风险",
        "借助惯性甩动杠铃"
      ],
      alternatives: ["dumbbell_row", "cable_row", "t_bar_row"]
    },
    {
      id: "lat_pulldown",
      name: "高位下拉",
      part: "背部",
      equipment: "器械",
      difficulty: "初级",
      videoUrl: "https://www.douyin.com/search/%E9%AB%98%E4%BD%8D%E4%B8%8B%E6%8B%89%E6%95%99%E5%AD%A6",
      instructions: [
        "坐在器械座位上，大腿固定于腿垫下方",
        "双手宽握拉杆，握距略宽于肩宽",
        "身体略微后仰，挺胸，核心收紧",
        "吸气，用背部力量将拉杆拉向胸部上方",
        "下拉时手肘向两侧打开，肩胛骨下沉后收",
        "呼气，控制拉杆缓慢回至起始位置"
      ],
      commonMistakes: [
        "借助身体后仰摆动完成动作",
        "下拉时耸肩",
        "回位时速度过快，失去控制"
      ],
      alternatives: ["pull_up", "single_arm_lat_pulldown", "cable_pullover"]
    },
    {
      id: "seated_cable_row",
      name: "坐姿绳索划船",
      part: "背部",
      equipment: "绳索",
      difficulty: "初级",
      videoUrl: "https://www.douyin.com/search/%E5%9D%90%E5%A7%BF%E7%BB%B3%E7%B4%A2%E5%88%92%E8%88%B9%E6%95%99%E5%AD%A6",
      instructions: [
        "坐在器械座位上，双脚踩于踏板上",
        "双手握住V型把手或直杆，手臂伸直",
        "背部挺直，核心收紧，胸部挺起",
        "吸气，用背部力量将把手拉向腹部",
        "拉起时手肘贴近身体，肩胛骨后收",
        "呼气，控制把手缓慢前伸至手臂伸直"
      ],
      commonMistakes: [
        "借助身体前后摆动完成动作",
        "拉起时耸肩",
        "背部拱起"
      ],
      alternatives: ["barbell_row", "machine_row", "dumbbell_row"]
    },
    {
      id: "dumbbell_row",
      name: "单臂哑铃划船",
      part: "背部",
      equipment: "哑铃",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E5%93%91%E9%93%83%E5%88%92%E8%88%B9%E6%95%99%E5%AD%A6",
      instructions: [
        "一手握哑铃，对侧手和膝支撑于平凳上",
        "背部保持平直，与地面平行",
        "握哑铃的手臂自然下垂，掌心朝向身体",
        "吸气，将哑铃拉向髋部位置",
        "拉起时手肘贴近身体，肩胛骨后收",
        "呼气，控制哑铃下放至手臂伸直"
      ],
      commonMistakes: [
        "身体旋转借力",
        "背部拱起或塌陷",
        "拉起时耸肩"
      ],
      alternatives: ["barbell_row", "cable_row", "machine_row"]
    },
    {
      id: "t_bar_row",
      name: "T杠划船",
      part: "背部",
      equipment: "器械",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/T%E6%9D%A0%E5%88%92%E8%88%B9%E6%95%99%E5%AD%A6",
      instructions: [
        "将杠铃一端固定于T杠器械或墙角",
        "双脚跨立于杠铃两侧，屈髋前倾",
        "双手握住T杠把手或杠铃杆",
        "背部挺直，核心收紧",
        "吸气，将杠铃拉向胸部下方",
        "呼气，控制杠铃下放至手臂伸直"
      ],
      commonMistakes: [
        "借助腿部力量抬起杠铃",
        "背部拱起",
        "拉起时耸肩"
      ],
      alternatives: ["barbell_row", "cable_row", "machine_row"]
    },
    {
      id: "chin_up",
      name: "反握引体向上",
      part: "背部",
      equipment: "自重",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E5%8F%8D%E6%8F%A1%E5%BC%95%E4%BD%93%E5%90%91%E4%B8%8A%E6%95%99%E5%AD%A6",
      instructions: [
        "双手反握单杠（掌心朝向自己），握距与肩同宽",
        "身体自然悬垂，核心收紧",
        "吸气，用背部和二头肌力量将身体拉起",
        "拉起至下巴超过单杠",
        "呼气，控制身体缓慢下降至手臂伸直",
        "全程保持身体稳定"
      ],
      commonMistakes: [
        "借助身体摆动完成动作",
        "下降时速度过快",
        "拉起时耸肩"
      ],
      alternatives: ["pull_up", "lat_pulldown", "assisted_chin_up"]
    },
    {
      id: "romanian_deadlift",
      name: "罗马尼亚硬拉",
      part: "背部",
      equipment: "杠铃",
      difficulty: "中级",
      videoUrl: "https://m.douyin.com/share/video/7144188957696331038",
      instructions: [
        "双脚与肩同宽站立，双手正握杠铃",
        "背部挺直，核心收紧，肩胛骨后收",
        "吸气，屈髋将杠铃沿大腿前侧下放",
        "下放至杠铃低于膝盖或感觉腘绳肌拉伸",
        "保持膝盖微屈，角度基本不变",
        "呼气，伸髋将杠铃拉起至身体挺直"
      ],
      commonMistakes: [
        "背部拱起",
        "膝盖过度弯曲变成深蹲",
        "杠铃远离身体"
      ],
      alternatives: ["deadlift", "stiff_leg_deadlift", "good_morning"]
    },
    {
      id: "straight_arm_pulldown",
      name: "直臂下压",
      part: "背部",
      equipment: "绳索",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E7%9B%B4%E8%87%82%E4%B8%8B%E5%8E%8B%E6%95%99%E5%AD%A6",
      instructions: [
        "面对龙门架站立，将滑轮调至高位",
        "双手握住直杆或绳索，手臂伸直举过头顶",
        "身体略微前倾，核心收紧",
        "保持手臂伸直，用背阔肌力量将杆下压",
        "下压至大腿前方位置",
        "控制缓慢回至起始位置"
      ],
      commonMistakes: [
        "手肘弯曲借力",
        "身体前后摆动",
        "耸肩借力"
      ],
      alternatives: ["lat_pulldown", "cable_pullover", "dumbbell_pullover"]
    },
    {
      id: "cable_face_pull",
      name: "绳索面拉",
      part: "背部",
      equipment: "绳索",
      difficulty: "初级",
      videoUrl: "https://www.douyin.com/search/%E7%BB%B3%E7%B4%A2%E9%9D%A2%E6%8B%89%E6%95%99%E5%AD%A6",
      instructions: [
        "将滑轮调至高位，双手握住绳索两端",
        "双脚前后开立，身体略微后倾",
        "吸气，将绳索拉向面部两侧",
        "拉起时手肘向两侧打开，肩胛骨后收",
        "呼气，控制绳索缓慢前伸",
        "全程保持核心稳定"
      ],
      commonMistakes: [
        "身体过度后仰借力",
        "拉起时耸肩",
        "手肘过度下垂"
      ],
      alternatives: ["reverse_pec_deck", "bent_over_lateral_raise", "cable_rear_delt_row"]
    },
    {
      id: "hyperextension",
      name: "山羊挺身",
      part: "背部",
      equipment: "器械",
      difficulty: "初级",
      videoUrl: "https://www.douyin.com/search/%E5%B1%B1%E7%BE%8A%E6%8C%BA%E8%BA%AB%E6%95%99%E5%AD%A6",
      instructions: [
        "俯卧于罗马椅上，髋部贴紧垫板边缘",
        "双脚固定于脚托，双手交叉于胸前或抱头",
        "身体自然下垂，背部保持平直",
        "吸气，用下背部力量将身体抬起",
        "抬起至身体与腿部成一条直线",
        "呼气，控制身体缓慢下放"
      ],
      commonMistakes: [
        "抬起过度，超过身体水平位置",
        "动作速度过快",
        "髋部未贴紧垫板"
      ],
      alternatives: ["back_extension", "superman", "bird_dog"]
    },
    {
      id: "pendlay_row",
      name: "潘德雷划船",
      part: "背部",
      equipment: "杠铃",
      difficulty: "高级",
      videoUrl: "https://www.douyin.com/search/%E6%BD%98%E5%BE%B7%E9%9B%B7%E5%88%92%E8%88%B9%E6%95%99%E5%AD%A6",
      instructions: [
        "双脚与肩同宽站立，杠铃置于地面",
        "屈髋前倾，背部与地面平行",
        "双手正握杠铃，握距略宽于肩宽",
        "吸气，爆发式将杠铃拉向胸部下方",
        "拉起时肩胛骨后收，手肘贴近身体",
        "每次下放时杠铃触地，完全放松后再拉起"
      ],
      commonMistakes: [
        "背部拱起",
        "拉起时身体抬起",
        "借助惯性完成动作"
      ],
      alternatives: ["barbell_row", "dumbbell_row", "t_bar_row"]
    },
    {
      id: "chest_supported_row",
      name: "胸部支撑划船",
      part: "背部",
      equipment: "哑铃",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E8%83%B8%E9%83%A8%E6%94%AF%E6%92%91%E5%88%92%E8%88%B9%E6%95%99%E5%AD%A6",
      instructions: [
        "俯卧于上斜卧推凳上，胸部贴紧凳面",
        "双手各持哑铃自然下垂",
        "双脚踩地，核心收紧",
        "吸气，将哑铃拉向髋部位置",
        "拉起时手肘贴近身体，肩胛骨后收",
        "呼气，控制哑铃下放至手臂伸直"
      ],
      commonMistakes: [
        "拉起时胸部离开凳面",
        "耸肩借力",
        "动作速度过快"
      ],
      alternatives: ["dumbbell_row", "machine_row", "seal_row"]
    },
    {
      id: "inverted_row",
      name: "反向划船",
      part: "背部",
      equipment: "自重",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E5%8F%8D%E5%90%91%E5%88%92%E8%88%B9%E6%95%99%E5%AD%A6",
      instructions: [
        "将杠铃杆调至腰部高度，或选择低单杠",
        "仰卧于杠铃下方，双手正握杠铃",
        "身体呈一条直线，脚跟着地",
        "吸气，用背部力量将胸部拉向杠铃",
        "呼气，控制身体缓慢下放至手臂伸直",
        "全程保持身体挺直"
      ],
      commonMistakes: [
        "臀部塌陷或翘起",
        "借助腿部蹬地借力",
        "拉起时耸肩"
      ],
      alternatives: ["seated_cable_row", "machine_row", "dumbbell_row"]
    },
    {
      id: "machine_row",
      name: "器械划船",
      part: "背部",
      equipment: "器械",
      difficulty: "初级",
      videoUrl: "https://www.douyin.com/search/%E5%99%A8%E6%A2%B0%E5%88%92%E8%88%B9%E6%95%99%E5%AD%A6",
      instructions: [
        "坐在器械座位上，胸部贴紧胸垫",
        "双手握住把手，手臂伸直",
        "双脚踩于踏板上，核心收紧",
        "吸气，将把手拉向腹部",
        "拉起时肩胛骨后收，手肘贴近身体",
        "呼气，控制把手前伸至手臂伸直"
      ],
      commonMistakes: [
        "拉起时胸部离开胸垫",
        "耸肩借力",
        "动作速度过快"
      ],
      alternatives: ["seated_cable_row", "barbell_row", "chest_supported_row"]
    },
    {
      id: "dumbbell_pullover",
      name: "哑铃上拉",
      part: "背部",
      equipment: "哑铃",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E5%93%91%E9%93%83%E4%B8%8A%E6%8B%89%E6%95%99%E5%AD%A6",
      instructions: [
        "仰卧于平凳上，双手托住一只哑铃于胸部上方",
        "手肘微屈，掌心托住哑铃片一侧",
        "吸气，控制哑铃缓慢下放至头顶后方",
        "下放至感觉背阔肌充分拉伸",
        "呼气，用背阔肌力量将哑铃拉回起始位置",
        "全程保持手肘角度不变"
      ],
      commonMistakes: [
        "手肘过度弯曲",
        "下放幅度不足",
        "耸肩借力"
      ],
      alternatives: ["cable_pullover", "straight_arm_pulldown", "lat_pulldown"]
    }
  ],

  // ========== 腿部肌群 ==========
  legs: [
    {
      id: "squat",
      name: "深蹲",
      part: "腿部",
      equipment: "杠铃",
      difficulty: "中级",
      videoUrl: "https://jingxuan.douyin.com/m/video/7498954440176471356",
      instructions: [
        "将杠铃置于斜方肌上部，双手握距略宽于肩",
        "双脚与肩同宽或略宽，脚尖略微外展",
        "背部挺直，核心收紧，胸部挺起",
        "吸气，屈髋屈膝下蹲，臀部向后下方坐",
        "下蹲至大腿与地面平行或更低",
        "呼气，伸髋伸膝站起至起始位置"
      ],
      commonMistakes: [
        "膝盖内扣，增加膝关节压力",
        "脚跟离地，重心前移",
        "背部拱起或过度前倾"
      ],
      alternatives: ["front_squat", "goblet_squat", "leg_press"]
    },
    {
      id: "leg_press",
      name: "腿举",
      part: "腿部",
      equipment: "器械",
      difficulty: "初级",
      videoUrl: "https://www.douyin.com/search/%E8%85%BF%E4%B8%BE%E6%95%99%E5%AD%A6",
      instructions: [
        "坐在腿举机上，背部和臀部紧贴靠垫",
        "双脚置于踏板上，间距与肩同宽",
        "吸气，屈髋屈膝将踏板缓慢下放",
        "下放至大腿接近胸部，膝盖约呈90度",
        "呼气，伸膝伸髋将踏板推起",
        "推起时膝盖保持微屈，不要完全锁死"
      ],
      commonMistakes: [
        "膝盖内扣",
        "推起时膝盖完全锁死",
        "下放时臀部离开靠垫"
      ],
      alternatives: ["squat", "hack_squat", "bulgarian_split_squat"]
    },
    {
      id: "romanian_deadlift_legs",
      name: "罗马尼亚硬拉",
      part: "腿部",
      equipment: "杠铃",
      difficulty: "中级",
      videoUrl: "https://jingxuan.douyin.com/m/video/7489809147660143930",
      instructions: [
        "双脚与肩同宽站立，双手正握杠铃",
        "背部挺直，核心收紧，肩胛骨后收",
        "吸气，屈髋将杠铃沿大腿前侧下放",
        "下放至杠铃低于膝盖或感觉腘绳肌拉伸",
        "保持膝盖微屈，角度基本不变",
        "呼气，伸髋将杠铃拉起至身体挺直"
      ],
      commonMistakes: [
        "背部拱起",
        "膝盖过度弯曲变成深蹲",
        "杠铃远离身体"
      ],
      alternatives: ["stiff_leg_deadlift", "good_morning", "leg_curl"]
    },
    {
      id: "walking_lunge",
      name: "行走箭步蹲",
      part: "腿部",
      equipment: "哑铃",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E8%A1%8C%E8%B5%B0%E7%AE%AD%E6%AD%A5%E8%B9%B2%E6%95%99%E5%AD%A6",
      instructions: [
        "双手各持哑铃自然垂于身体两侧",
        "双脚并拢站立，核心收紧，胸部挺起",
        "向前迈出一大步，后脚脚尖着地",
        "吸气，屈髋屈膝下蹲至前腿大腿与地面平行",
        "呼气，伸髋伸膝站起，后脚向前迈出",
        "交替进行行走箭步蹲"
      ],
      commonMistakes: [
        "前腿膝盖过度前移超过脚尖",
        "身体前倾或后仰",
        "步幅过小，下蹲幅度不足"
      ],
      alternatives: ["stationary_lunge", "bulgarian_split_squat", "step_up"]
    },
    {
      id: "leg_extension",
      name: "腿屈伸",
      part: "腿部",
      equipment: "器械",
      difficulty: "初级",
      videoUrl: "https://www.douyin.com/search/%E8%85%BF%E5%B1%88%E4%BC%B8%E6%95%99%E5%AD%A6",
      instructions: [
        "坐在腿屈伸机上，背部紧贴靠垫",
        "小腿前侧贴紧腿垫，膝盖与转轴对齐",
        "双手握住座椅两侧把手",
        "吸气，伸膝将腿垫向上抬起",
        "抬至双腿伸直但不锁死膝盖",
        "呼气，控制腿垫缓慢下放至起始位置"
      ],
      commonMistakes: [
        "推起时膝盖完全锁死",
        "臀部离开座椅借力",
        "动作速度过快"
      ],
      alternatives: ["squat", "leg_press", "goblet_squat"]
    },
    {
      id: "leg_curl",
      name: "腿弯举",
      part: "腿部",
      equipment: "器械",
      difficulty: "初级",
      videoUrl: "https://www.douyin.com/search/%E8%85%BF%E5%BC%AF%E4%B8%BE%E6%95%99%E5%AD%A6",
      instructions: [
        "俯卧于腿弯举机上，小腿后侧贴紧腿垫",
        "膝盖位于垫子边缘，双手握住前侧把手",
        "吸气，屈膝将腿垫向臀部方向抬起",
        "抬至小腿与地面垂直或接近臀部",
        "呼气，控制腿垫缓慢下放至起始位置",
        "全程保持大腿贴紧垫子"
      ],
      commonMistakes: [
        "臀部抬起借力",
        "下放时速度过快",
        "大腿离开垫子"
      ],
      alternatives: ["seated_leg_curl", "romanian_deadlift", "stiff_leg_deadlift"]
    },
    {
      id: "bulgarian_split_squat",
      name: "保加利亚分腿蹲",
      part: "腿部",
      equipment: "哑铃",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E4%BF%9D%E5%8A%A0%E5%88%A9%E4%BA%9A%E5%88%86%E8%85%BF%E8%B9%B2%E6%95%99%E5%AD%A6",
      instructions: [
        "双手各持哑铃自然垂于身体两侧",
        "后脚脚背置于平凳上，前脚向前迈出一大步",
        "身体挺直，核心收紧",
        "吸气，屈髋屈膝下蹲至前腿大腿与地面平行",
        "呼气，伸髋伸膝站起至起始位置",
        "完成一侧次数后换另一侧"
      ],
      commonMistakes: [
        "前腿膝盖过度前移",
        "身体过度前倾",
        "膝盖内扣"
      ],
      alternatives: ["walking_lunge", "stationary_lunge", "step_up"]
    },
    {
      id: "goblet_squat",
      name: "高脚杯深蹲",
      part: "腿部",
      equipment: "哑铃",
      difficulty: "初级",
      videoUrl: "https://www.douyin.com/search/%E9%AB%98%E8%84%9A%E6%9D%AF%E6%B7%B1%E8%B9%B2%E6%95%99%E5%AD%A6",
      instructions: [
        "双手捧住一只哑铃于胸部前方，哑铃竖直",
        "双脚与肩同宽或略宽，脚尖略微外展",
        "背部挺直，核心收紧",
        "吸气，屈髋屈膝下蹲，臀部向后下方坐",
        "下蹲至大腿与地面平行或更低",
        "呼气，伸髋伸膝站起至起始位置"
      ],
      commonMistakes: [
        "膝盖内扣",
        "脚跟离地",
        "背部拱起"
      ],
      alternatives: ["squat", "front_squat", "leg_press"]
    },
    {
      id: "hack_squat",
      name: "哈克深蹲",
      part: "腿部",
      equipment: "器械",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E5%93%88%E5%85%8B%E6%B7%B1%E8%B9%B2%E6%95%99%E5%AD%A6",
      instructions: [
        "站于哈克深蹲机上，背部紧贴靠垫",
        "双脚置于踏板上，间距与肩同宽",
        "肩部抵住肩垫，双手握住两侧把手",
        "吸气，屈髋屈膝下蹲",
        "下蹲至大腿与地面平行或更低",
        "呼气，伸髋伸膝站起至起始位置"
      ],
      commonMistakes: [
        "膝盖内扣",
        "下蹲时臀部离开靠垫",
        "站起时膝盖完全锁死"
      ],
      alternatives: ["squat", "leg_press", "front_squat"]
    },
    {
      id: "front_squat",
      name: "颈前深蹲",
      part: "腿部",
      equipment: "杠铃",
      difficulty: "高级",
      videoUrl: "https://www.douyin.com/search/%E9%A2%88%E5%89%8D%E6%B7%B1%E8%B9%B2%E6%95%99%E5%AD%A6",
      instructions: [
        "将杠铃置于锁骨上方，双手交叉或正握托住杠铃",
        "肘部抬高，上臂与地面平行",
        "双脚与肩同宽，脚尖略微外展",
        "吸气，屈髋屈膝下蹲，保持躯干直立",
        "下蹲至大腿与地面平行或更低",
        "呼气，伸髋伸膝站起至起始位置"
      ],
      commonMistakes: [
        "肘部下沉，杠铃向前滚动",
        "膝盖内扣",
        "躯干过度前倾"
      ],
      alternatives: ["squat", "goblet_squat", "hack_squat"]
    },
    {
      id: "stiff_leg_deadlift",
      name: "直腿硬拉",
      part: "腿部",
      equipment: "杠铃",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E7%9B%B4%E8%85%BF%E7%A1%AC%E6%8B%89%E6%95%99%E5%AD%A6",
      instructions: [
        "双脚与肩同宽站立，双手正握杠铃",
        "背部挺直，核心收紧，膝盖几乎伸直",
        "吸气，屈髋将杠铃沿大腿前侧下放",
        "下放至杠铃接近地面或感觉腘绳肌充分拉伸",
        "呼气，伸髋将杠铃拉起至身体挺直",
        "全程保持膝盖角度基本不变"
      ],
      commonMistakes: [
        "背部拱起",
        "膝盖过度弯曲",
        "下放时弓背"
      ],
      alternatives: ["romanian_deadlift", "good_morning", "leg_curl"]
    },
    {
      id: "step_up",
      name: "登阶",
      part: "腿部",
      equipment: "哑铃",
      difficulty: "初级",
      videoUrl: "https://www.douyin.com/search/%E7%99%BB%E9%98%B6%E6%95%99%E5%AD%A6",
      instructions: [
        "双手各持哑铃自然垂于身体两侧",
        "站于平凳或跳箱前，双脚与肩同宽",
        "一脚踩于平凳上，全脚掌着地",
        "呼气，用前腿力量将身体向上蹬起",
        "后腿跟随踏上平凳，身体站直",
        "吸气，控制后退下，交替进行"
      ],
      commonMistakes: [
        "用后腿蹬地借力",
        "身体前倾过度",
        "膝盖内扣"
      ],
      alternatives: ["bulgarian_split_squat", "walking_lunge", "leg_press"]
    },
    {
      id: "calf_raise",
      name: "提踵",
      part: "腿部",
      equipment: "器械",
      difficulty: "初级",
      videoUrl: "https://www.douyin.com/search/%E6%8F%90%E8%B8%B5%E6%95%99%E5%AD%A6",
      instructions: [
        "站于提踵机上，肩部抵住肩垫",
        "前脚掌踩于踏板边缘，脚跟悬空",
        "双手握住两侧把手，身体挺直",
        "吸气，控制脚跟下放至小腿充分拉伸",
        "呼气，用小腿力量将脚跟抬起",
        "抬至脚尖支撑，小腿充分收缩"
      ],
      commonMistakes: [
        "借助腿部力量完成动作",
        "动作幅度不足",
        "动作速度过快"
      ],
      alternatives: ["standing_calf_raise", "seated_calf_raise", "donkey_calf_raise"]
    },
    {
      id: "seated_leg_curl",
      name: "坐姿腿弯举",
      part: "腿部",
      equipment: "器械",
      difficulty: "初级",
      videoUrl: "https://www.douyin.com/search/%E5%9D%90%E5%A7%BF%E8%85%BF%E5%BC%AF%E4%B8%BE%E6%95%99%E5%AD%A6",
      instructions: [
        "坐于腿弯举机上，背部紧贴靠垫",
        "小腿后侧贴紧腿垫，大腿压于大腿垫下",
        "双手握住座椅两侧把手",
        "吸气，屈膝将腿垫向臀部方向拉动",
        "拉至小腿接近垂直或极限位置",
        "呼气，控制腿垫缓慢回至起始位置"
      ],
      commonMistakes: [
        "臀部离开座椅借力",
        "身体前倾",
        "动作速度过快"
      ],
      alternatives: ["leg_curl", "romanian_deadlift", "stiff_leg_deadlift"]
    },
    {
      id: "sumo_deadlift",
      name: "相扑硬拉",
      part: "腿部",
      equipment: "杠铃",
      difficulty: "高级",
      videoUrl: "https://www.douyin.com/search/%E7%9B%B8%E6%89%91%E7%A1%AC%E6%8B%89%E6%95%99%E5%AD%A6",
      instructions: [
        "双脚宽站距站立，脚尖大幅外展",
        "双手自然下垂握杠铃，握距与肩同宽",
        "背部挺直，核心收紧",
        "吸气，伸髋伸膝将杠铃拉起，贴近身体",
        "站直时臀部收紧，不要过度后仰",
        "呼气，控制杠铃下放至地面"
      ],
      commonMistakes: [
        "背部拱起",
        "杠铃远离身体",
        "膝盖内扣"
      ],
      alternatives: ["deadlift", "romanian_deadlift", "trap_bar_deadlift"]
    },
    {
      id: "sissy_squat",
      name: "西斯深蹲",
      part: "腿部",
      equipment: "自重",
      difficulty: "高级",
      videoUrl: "https://www.douyin.com/search/%E8%A5%BF%E6%96%AF%E6%B7%B1%E8%B9%B2%E6%95%99%E5%AD%A6",
      instructions: [
        "双脚与肩同宽站立，可扶固定物保持平衡",
        "脚跟抬起，用脚尖支撑",
        "身体挺直，核心收紧",
        "吸气，屈膝下蹲，身体向后下方倾斜",
        "膝盖向前超过脚尖，下蹲至极限",
        "呼气，伸膝站起至起始位置"
      ],
      commonMistakes: [
        "脚跟落地",
        "身体前倾过度",
        "膝盖内扣"
      ],
      alternatives: ["leg_extension", "squat", "hack_squat"]
    },
    {
      id: "good_morning",
      name: "早安式",
      part: "腿部",
      equipment: "杠铃",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E6%97%A9%E5%AE%89%E5%BC%8F%E6%95%99%E5%AD%A6",
      instructions: [
        "将杠铃置于斜方肌上部，双手握稳",
        "双脚与肩同宽站立，膝盖微屈",
        "背部挺直，核心收紧",
        "吸气，屈髋上身前倾",
        "前倾至上身与地面平行或感觉腘绳肌拉伸",
        "呼气，伸髋将上身抬起至直立"
      ],
      commonMistakes: [
        "背部拱起",
        "膝盖过度弯曲",
        "上身旋转"
      ],
      alternatives: ["romanian_deadlift", "stiff_leg_deadlift", "back_extension"]
    }
  ],

  // ========== 肩部肌群 ==========
  shoulders: [
    {
      id: "overhead_press",
      name: "杠铃推举",
      part: "肩部",
      equipment: "杠铃",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E6%9D%A0%E9%93%83%E6%8E%A8%E4%B8%BE%E6%95%99%E5%AD%A6",
      instructions: [
        "双脚与肩同宽站立，杠铃置于锁骨上方",
        "双手握距略宽于肩宽，肘部向前",
        "核心收紧，臀部和腹部保持紧张",
        "吸气，将杠铃向上推起至手臂伸直",
        "推起时头部略微后倾，杠铃过脸后头部前移",
        "呼气，控制杠铃下放至锁骨位置"
      ],
      commonMistakes: [
        "腰部过度后仰，增加腰椎压力",
        "杠铃轨迹偏离身体中线",
        "推起时耸肩借力"
      ],
      alternatives: ["dumbbell_shoulder_press", "machine_shoulder_press", "push_press"]
    },
    {
      id: "dumbbell_shoulder_press",
      name: "哑铃推举",
      part: "肩部",
      equipment: "哑铃",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E5%93%91%E9%93%83%E6%8E%A8%E4%B8%BE%E6%95%99%E5%AD%A6",
      instructions: [
        "坐于有靠背的座椅上，双手各持哑铃举于肩部两侧",
        "掌心朝前，肘部向两侧打开",
        "背部紧贴靠背，核心收紧",
        "吸气，将哑铃向上推起至手臂伸直",
        "推起时哑铃略微内收，在顶端不碰撞",
        "呼气，控制哑铃下放至肩部两侧"
      ],
      commonMistakes: [
        "背部离开靠背借力",
        "推起时耸肩",
        "哑铃碰撞"
      ],
      alternatives: ["overhead_press", "machine_shoulder_press", "arnold_press"]
    },
    {
      id: "lateral_raise",
      name: "侧平举",
      part: "肩部",
      equipment: "哑铃",
      difficulty: "初级",
      videoUrl: "https://m.douyin.com/zhuanti/7382806022101960743",
      instructions: [
        "双手各持哑铃自然垂于身体两侧",
        "双脚与肩同宽站立，膝盖微屈",
        "核心收紧，胸部挺起",
        "吸气，将哑铃向两侧抬起",
        "抬至大臂与地面平行，肘部微屈",
        "呼气，控制哑铃缓慢下放至起始位置"
      ],
      commonMistakes: [
        "借助身体摆动完成动作",
        "抬得过高，超过肩部水平",
        "耸肩借力"
      ],
      alternatives: ["cable_lateral_raise", "machine_lateral_raise", "upright_row"]
    },
    {
      id: "front_raise",
      name: "前平举",
      part: "肩部",
      equipment: "哑铃",
      difficulty: "初级",
      videoUrl: "https://www.douyin.com/search/%E5%89%8D%E5%B9%B3%E4%B8%BE%E6%95%99%E5%AD%A6",
      instructions: [
        "双手各持哑铃自然垂于身体前方",
        "双脚与肩同宽站立，膝盖微屈",
        "核心收紧，掌心朝向大腿",
        "吸气，将哑铃向前方抬起",
        "抬至大臂与地面平行",
        "呼气，控制哑铃缓慢下放至起始位置"
      ],
      commonMistakes: [
        "借助身体后仰借力",
        "耸肩",
        "动作速度过快"
      ],
      alternatives: ["cable_front_raise", "plate_front_raise", "overhead_press"]
    },
    {
      id: "rear_delt_fly",
      name: "俯身飞鸟",
      part: "肩部",
      equipment: "哑铃",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E4%BF%AF%E8%BA%AB%E9%A3%9E%E9%B8%9F%E6%95%99%E5%AD%A6",
      instructions: [
        "双手各持哑铃，双脚与肩同宽站立",
        "屈髋前倾，背部与地面接近平行",
        "双臂自然下垂，掌心相对",
        "吸气，将哑铃向两侧抬起",
        "抬至大臂与地面平行，手肘微屈",
        "呼气，控制哑铃缓慢下放"
      ],
      commonMistakes: [
        "背部拱起",
        "借助身体摆动",
        "耸肩借力"
      ],
      alternatives: ["reverse_pec_deck", "cable_rear_delt_fly", "face_pull"]
    },
    {
      id: "upright_row",
      name: "直立划船",
      part: "肩部",
      equipment: "杠铃",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E7%9B%B4%E7%AB%8B%E5%88%92%E8%88%B9%E6%95%99%E5%AD%A6",
      instructions: [
        "双脚与肩同宽站立，双手正握杠铃",
        "握距略窄于肩宽，杠铃自然下垂",
        "核心收紧，胸部挺起",
        "吸气，将杠铃沿身体向上拉起",
        "拉至杠铃接近下巴位置，手肘抬高",
        "呼气，控制杠铃缓慢下放"
      ],
      commonMistakes: [
        "手肘过度抬高，增加肩关节压力",
        "借助身体摆动",
        "耸肩借力"
      ],
      alternatives: ["cable_upright_row", "dumbbell_upright_row", "lateral_raise"]
    },
    {
      id: "arnold_press",
      name: "阿诺德推举",
      part: "肩部",
      equipment: "哑铃",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E9%98%BF%E8%AF%BA%E5%BE%B7%E6%8E%A8%E4%B8%BE%E6%95%99%E5%AD%A6",
      instructions: [
        "坐于座椅上，双手各持哑铃举于肩部",
        "掌心朝向自己，肘部向前",
        "背部挺直，核心收紧",
        "吸气，外旋手臂同时将哑铃向上推起",
        "推至顶端时掌心朝前，手臂伸直",
        "呼气，反向动作下放哑铃"
      ],
      commonMistakes: [
        "动作过程中耸肩",
        "背部离开靠背",
        "旋转动作不流畅"
      ],
      alternatives: ["dumbbell_shoulder_press", "overhead_press", "machine_shoulder_press"]
    },
    {
      id: "machine_shoulder_press",
      name: "器械推举",
      part: "肩部",
      equipment: "器械",
      difficulty: "初级",
      videoUrl: "https://www.douyin.com/search/%E5%99%A8%E6%A2%B0%E6%8E%A8%E4%B8%BE%E6%95%99%E5%AD%A6",
      instructions: [
        "坐于器械上，背部紧贴靠背",
        "调整座椅高度使把手与肩部平齐",
        "双手握住把手，掌心朝前",
        "吸气，将把手向上推起至手臂伸直",
        "呼气，控制把手下放至起始位置",
        "全程保持背部贴紧靠背"
      ],
      commonMistakes: [
        "推起时耸肩",
        "背部离开靠背",
        "推起时膝盖完全锁死"
      ],
      alternatives: ["dumbbell_shoulder_press", "overhead_press", "smith_machine_press"]
    },
    {
      id: "cable_lateral_raise",
      name: "绳索侧平举",
      part: "肩部",
      equipment: "绳索",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E7%BB%B3%E7%B4%A2%E4%BE%A7%E5%B9%B3%E4%B8%BE%E6%95%99%E5%AD%A6",
      instructions: [
        "将滑轮调至低位，单手拉住把手",
        "身体略微侧倾，对侧手扶固定物",
        "吸气，将手臂向侧上方抬起",
        "抬至大臂与地面平行",
        "呼气，控制手臂缓慢下放",
        "完成一侧后换另一侧"
      ],
      commonMistakes: [
        "身体过度侧倾借力",
        "耸肩",
        "动作速度过快"
      ],
      alternatives: ["dumbbell_lateral_raise", "machine_lateral_raise", "upright_row"]
    },
    {
      id: "reverse_pec_deck",
      name: "反向蝴蝶机",
      part: "肩部",
      equipment: "器械",
      difficulty: "初级",
      videoUrl: "https://www.douyin.com/search/%E5%8F%8D%E5%90%91%E8%9D%B4%E8%9D%B6%E6%9C%BA%E6%95%99%E5%AD%A6",
      instructions: [
        "面向蝴蝶机反向坐于座位上",
        "胸部贴紧靠背，双手握住把手",
        "手肘微屈，双臂向两侧展开",
        "吸气，将把手向后拉，肩胛骨后收",
        "拉至后束充分收缩",
        "呼气，控制把手缓慢回至起始位置"
      ],
      commonMistakes: [
        "拉起时耸肩",
        "胸部离开靠背",
        "手肘过度伸直"
      ],
      alternatives: ["rear_delt_fly", "cable_rear_delt_fly", "face_pull"]
    },
    {
      id: "push_press",
      name: "借力推举",
      part: "肩部",
      equipment: "杠铃",
      difficulty: "高级",
      videoUrl: "https://www.douyin.com/search/%E5%80%9F%E5%8A%9B%E6%8E%A8%E4%B8%BE%E6%95%99%E5%AD%A6",
      instructions: [
        "双脚与肩同宽站立，杠铃置于锁骨上方",
        "双手握距略宽于肩宽",
        "吸气，屈膝下蹲蓄力",
        "快速伸髋伸膝，借助腿部力量将杠铃推起",
        "手臂伸直支撑杠铃于头顶",
        "控制杠铃下放至锁骨位置"
      ],
      commonMistakes: [
        "腿部发力不足",
        "推起后身体过度后仰",
        "下放时失去控制"
      ],
      alternatives: ["overhead_press", "jerk", "dumbbell_shoulder_press"]
    },
    {
      id: "face_pull",
      name: "面拉",
      part: "肩部",
      equipment: "绳索",
      difficulty: "初级",
      videoUrl: "https://www.douyin.com/search/%E9%9D%A2%E6%8B%89%E6%95%99%E5%AD%A6",
      instructions: [
        "将滑轮调至高位，双手握住绳索两端",
        "双脚前后开立，身体略微后倾",
        "吸气，将绳索拉向面部两侧",
        "拉起时手肘向两侧打开，肩胛骨后收",
        "呼气，控制绳索缓慢前伸",
        "全程保持核心稳定"
      ],
      commonMistakes: [
        "身体过度后仰借力",
        "拉起时耸肩",
        "手肘过度下垂"
      ],
      alternatives: ["reverse_pec_deck", "rear_delt_fly", "cable_rear_delt_row"]
    },
    {
      id: "dumbbell_shrug",
      name: "哑铃耸肩",
      part: "肩部",
      equipment: "哑铃",
      difficulty: "初级",
      videoUrl: "https://www.douyin.com/search/%E5%93%91%E9%93%83%E8%80%B8%E8%82%A9%E6%95%99%E5%AD%A6",
      instructions: [
        "双手各持哑铃自然垂于身体两侧",
        "双脚与肩同宽站立，核心收紧",
        "吸气，耸肩将哑铃向上提起",
        "提至斜方肌充分收缩，停留片刻",
        "呼气，控制哑铃缓慢下放",
        "全程保持手臂伸直"
      ],
      commonMistakes: [
        "借助手臂力量提起哑铃",
        "耸肩时身体前后摆动",
        "动作速度过快"
      ],
      alternatives: ["barbell_shrug", "machine_shrug", "upright_row"]
    },
    {
      id: "cable_front_raise",
      name: "绳索前平举",
      part: "肩部",
      equipment: "绳索",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E7%BB%B3%E7%B4%A2%E5%89%8D%E5%B9%B3%E4%B8%BE%E6%95%99%E5%AD%A6",
      instructions: [
        "背对龙门架站立，将滑轮调至低位",
        "双手从胯下握住绳索把手",
        "身体略微前倾，核心收紧",
        "吸气，将手臂向前上方抬起",
        "抬至大臂与地面平行",
        "呼气，控制手臂缓慢下放"
      ],
      commonMistakes: [
        "身体后仰借力",
        "耸肩",
        "动作速度过快"
      ],
      alternatives: ["dumbbell_front_raise", "plate_front_raise", "overhead_press"]
    },
    {
      id: "landmine_press_shoulders",
      name: "地雷管推举",
      part: "肩部",
      equipment: "杠铃",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E5%9C%B0%E9%9B%B7%E7%AE%A1%E6%8E%A8%E4%B8%BE%E6%95%99%E5%AD%A6",
      instructions: [
        "将杠铃一端固定于地雷管底座",
        "双手握住杠铃另一端，置于肩部前方",
        "双脚前后开立，核心收紧",
        "吸气，将杠铃向前上方推起",
        "推至手臂伸直，感受前束收缩",
        "呼气，控制杠铃下放至肩部"
      ],
      commonMistakes: [
        "身体过度后仰",
        "推起时耸肩",
        "杠铃轨迹不稳定"
      ],
      alternatives: ["overhead_press", "dumbbell_shoulder_press", "machine_shoulder_press"]
    },
    {
      id: "around_the_world",
      name: "环绕世界",
      part: "肩部",
      equipment: "哑铃",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E7%8E%AF%E7%BB%95%E4%B8%96%E7%95%8C%E6%95%99%E5%AD%A6",
      instructions: [
        "双手各持哑铃，自然垂于身体两侧",
        "掌心朝前，双脚与肩同宽站立",
        "核心收紧，胸部挺起",
        "吸气，将哑铃从身体两侧向前上方抬起",
        "继续向头顶方向移动，在头顶上方相遇",
        "呼气，控制哑铃沿原路径下放"
      ],
      commonMistakes: [
        "耸肩借力",
        "动作过程中身体摆动",
        "手肘过度弯曲"
      ],
      alternatives: ["lateral_raise", "front_raise", "arnold_press"]
    },
    {
      id: "cuban_press",
      name: "古巴推举",
      part: "肩部",
      equipment: "哑铃",
      difficulty: "高级",
      videoUrl: "https://www.douyin.com/search/%E5%8F%A4%E5%B7%B4%E6%8E%A8%E4%B8%BE%E6%95%99%E5%AD%A6",
      instructions: [
        "双手各持哑铃，自然垂于身体两侧",
        "双脚与肩同宽站立，核心收紧",
        "第一步：侧平举至大臂与地面平行",
        "第二步：屈肘外旋，小臂垂直向上",
        "第三步：将哑铃向上推起至手臂伸直",
        "反向动作下放哑铃"
      ],
      commonMistakes: [
        "旋转动作不流畅",
        "耸肩借力",
        "动作速度过快"
      ],
      alternatives: ["dumbbell_shoulder_press", "arnold_press", "upright_row"]
    }
  ],

  // ========== 手臂肌群 ==========
  arms: [
    {
      id: "barbell_curl",
      name: "杠铃弯举",
      part: "手臂",
      equipment: "杠铃",
      difficulty: "初级",
      videoUrl: "https://www.douyin.com/search/%E6%9D%A0%E9%93%83%E5%BC%AF%E4%B8%BE%E6%95%99%E5%AD%A6",
      instructions: [
        "双脚与肩同宽站立，双手正握杠铃",
        "握距与肩同宽，手臂自然下垂",
        "核心收紧，胸部挺起，肩胛骨下沉后收",
        "吸气，屈肘将杠铃向上弯举",
        "举至杠铃接近胸部，二头肌充分收缩",
        "呼气，控制杠铃缓慢下放至手臂伸直"
      ],
      commonMistakes: [
        "借助身体前后摆动完成动作",
        "肘部前移借力",
        "下放时速度过快"
      ],
      alternatives: ["dumbbell_curl", "ez_bar_curl", "cable_curl"]
    },
    {
      id: "dumbbell_curl",
      name: "哑铃弯举",
      part: "手臂",
      equipment: "哑铃",
      difficulty: "初级",
      videoUrl: "https://www.douyin.com/search/%E5%93%91%E9%93%83%E5%BC%AF%E4%B8%BE%E6%95%99%E5%AD%A6",
      instructions: [
        "双手各持哑铃自然垂于身体两侧",
        "双脚与肩同宽站立，掌心朝前",
        "核心收紧，肘部贴近身体两侧",
        "吸气，屈肘将哑铃向上弯举",
        "举至二头肌充分收缩，可外旋手腕增加收缩",
        "呼气，控制哑铃缓慢下放"
      ],
      commonMistakes: [
        "借助身体摆动",
        "肘部前移",
        "耸肩借力"
      ],
      alternatives: ["barbell_curl", "hammer_curl", "incline_dumbbell_curl"]
    },
    {
      id: "hammer_curl",
      name: "锤式弯举",
      part: "手臂",
      equipment: "哑铃",
      difficulty: "初级",
      videoUrl: "https://www.douyin.com/search/%E9%94%A4%E5%BC%8F%E5%BC%AF%E4%B8%BE%E6%95%99%E5%AD%A6",
      instructions: [
        "双手各持哑铃自然垂于身体两侧",
        "双脚与肩同宽站立，掌心朝向身体",
        "核心收紧，肘部贴近身体两侧",
        "吸气，屈肘将哑铃向上弯举",
        "举至二头肌和前臂充分收缩",
        "呼气，控制哑铃缓慢下放"
      ],
      commonMistakes: [
        "借助身体摆动",
        "肘部前移",
        "耸肩借力"
      ],
      alternatives: ["dumbbell_curl", "rope_curl", "cross_body_hammer_curl"]
    },
    {
      id: "tricep_pushdown",
      name: "三头下压",
      part: "手臂",
      equipment: "绳索",
      difficulty: "初级",
      videoUrl: "https://www.douyin.com/search/%E4%B8%89%E5%A4%B4%E4%B8%8B%E5%8E%8B%E6%95%99%E5%AD%A6",
      instructions: [
        "面对龙门架站立，将滑轮调至高位",
        "双手握住直杆或绳索，手肘贴近身体",
        "上臂固定不动，核心收紧",
        "吸气，屈肘将杆向上放至胸部位置",
        "呼气，伸肘将杆向下压至手臂伸直",
        "压至底端时三头肌充分收缩"
      ],
      commonMistakes: [
        "上臂前移，借助其他肌肉发力",
        "身体前倾借力",
        "动作速度过快"
      ],
      alternatives: ["overhead_tricep_extension", "skull_crusher", "close_grip_bench_press"]
    },
    {
      id: "skull_crusher",
      name: "碎颅者",
      part: "手臂",
      equipment: "杠铃",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E7%A2%8E%E9%A2%85%E8%80%85%E6%95%99%E5%AD%A6",
      instructions: [
        "平躺在卧推凳上，双手正握杠铃或曲杆",
        "手臂伸直举于胸部上方，与肩同宽",
        "上臂固定垂直于地面，核心收紧",
        "吸气，屈肘将杠铃向额头方向下放",
        "下放至杠铃接近额头，手肘保持固定",
        "呼气，伸肘将杠铃推回起始位置"
      ],
      commonMistakes: [
        "上臂晃动，失去固定",
        "杠铃下放位置过低",
        "肘部过度外展"
      ],
      alternatives: ["tricep_pushdown", "overhead_tricep_extension", "dumbbell_kickback"]
    },
    {
      id: "preacher_curl",
      name: "牧师凳弯举",
      part: "手臂",
      equipment: "杠铃",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E7%89%A7%E5%B8%88%E5%87%B3%E5%BC%AF%E4%B8%BE%E6%95%99%E5%AD%A6",
      instructions: [
        "坐于牧师凳上，上臂贴紧斜面垫板",
        "双手正握杠铃或曲杆，手臂伸直",
        "核心收紧，胸部贴紧靠垫",
        "吸气，屈肘将杠铃向上弯举",
        "举至二头肌充分收缩",
        "呼气，控制杠铃缓慢下放至手臂伸直"
      ],
      commonMistakes: [
        "上臂离开垫板借力",
        "身体后仰",
        "动作速度过快"
      ],
      alternatives: ["dumbbell_preacher_curl", "machine_curl", "spider_curl"]
    },
    {
      id: "overhead_tricep_extension",
      name: "颈后臂屈伸",
      part: "手臂",
      equipment: "哑铃",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E9%A2%88%E5%90%8E%E8%87%82%E5%B1%88%E4%BC%B8%E6%95%99%E5%AD%A6",
      instructions: [
        "双手托住一只哑铃举过头顶",
        "手肘贴近头部两侧，上臂固定",
        "核心收紧，身体挺直",
        "吸气，屈肘将哑铃下放至头后",
        "下放至手肘约呈90度",
        "呼气，伸肘将哑铃推回起始位置"
      ],
      commonMistakes: [
        "手肘向外打开",
        "上臂晃动",
        "耸肩借力"
      ],
      alternatives: ["cable_overhead_extension", "tricep_pushdown", "skull_crusher"]
    },
    {
      id: "concentration_curl",
      name: "集中弯举",
      part: "手臂",
      equipment: "哑铃",
      difficulty: "初级",
      videoUrl: "https://www.douyin.com/search/%E9%9B%86%E4%B8%AD%E5%BC%AF%E4%B8%BE%E6%95%99%E5%AD%A6",
      instructions: [
        "坐于平凳上，双腿分开",
        "一手握哑铃，上臂内侧贴紧大腿内侧",
        "手臂自然下垂，掌心朝前",
        "吸气，屈肘将哑铃向上弯举",
        "举至二头肌充分收缩",
        "呼气，控制哑铃缓慢下放",
        "完成一侧后换另一侧"
      ],
      commonMistakes: [
        "上臂离开大腿借力",
        "身体前倾或后仰",
        "动作速度过快"
      ],
      alternatives: ["dumbbell_curl", "preacher_curl", "spider_curl"]
    },
    {
      id: "cable_curl",
      name: "绳索弯举",
      part: "手臂",
      equipment: "绳索",
      difficulty: "初级",
      videoUrl: "https://www.douyin.com/search/%E7%BB%B3%E7%B4%A2%E5%BC%AF%E4%B8%BE%E6%95%99%E5%AD%A6",
      instructions: [
        "面对龙门架站立，将滑轮调至低位",
        "双手握住直杆，手肘贴近身体",
        "核心收紧，上臂固定不动",
        "吸气，屈肘将杆向上弯举",
        "举至二头肌充分收缩",
        "呼气，控制杆缓慢下放"
      ],
      commonMistakes: [
        "上臂前移借力",
        "身体后仰",
        "耸肩"
      ],
      alternatives: ["barbell_curl", "dumbbell_curl", "machine_curl"]
    },
    {
      id: "diamond_push_up",
      name: "钻石俯卧撑",
      part: "手臂",
      equipment: "自重",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E9%92%BB%E7%9F%B3%E4%BF%AF%E5%8D%A7%E6%92%91%E6%95%99%E5%AD%A6",
      instructions: [
        "双手撑地，拇指和食指相触形成钻石形状",
        "身体呈一条直线，核心收紧",
        "吸气，控制身体下降至胸部接近手部",
        "下降时手肘向两侧后方打开",
        "呼气，用三头肌力量将身体推起",
        "推起至手臂伸直但不锁死"
      ],
      commonMistakes: [
        "臀部塌陷或翘起",
        "手肘过度外展",
        "下降幅度不足"
      ],
      alternatives: ["close_grip_bench_press", "tricep_pushdown", "bench_dips"]
    },
    {
      id: "incline_dumbbell_curl",
      name: "上斜哑铃弯举",
      part: "手臂",
      equipment: "哑铃",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E4%B8%8A%E6%96%9C%E5%93%91%E9%93%83%E5%BC%AF%E4%B8%BE%E6%95%99%E5%AD%A6",
      instructions: [
        "将卧推凳调整至45-60度上斜角度",
        "双手各持哑铃，躺于凳上，手臂自然下垂",
        "掌心朝前，手肘微屈",
        "吸气，屈肘将哑铃向上弯举",
        "举至二头肌充分收缩",
        "呼气，控制哑铃缓慢下放"
      ],
      commonMistakes: [
        "耸肩借力",
        "手肘过度前移",
        "动作速度过快"
      ],
      alternatives: ["dumbbell_curl", "barbell_curl", "preacher_curl"]
    },
    {
      id: "rope_pushdown",
      name: "绳索下压",
      part: "手臂",
      equipment: "绳索",
      difficulty: "初级",
      videoUrl: "https://www.douyin.com/search/%E7%BB%B3%E7%B4%A2%E4%B8%8B%E5%8E%8B%E6%95%99%E5%AD%A6",
      instructions: [
        "面对龙门架站立，将滑轮调至高位",
        "双手握住绳索两端，手肘贴近身体",
        "上臂固定不动，核心收紧",
        "吸气，屈肘将绳索向上放",
        "呼气，伸肘将绳索向下压",
        "压至底端时向两侧分开绳索，增加收缩"
      ],
      commonMistakes: [
        "上臂前移借力",
        "身体前倾",
        "底端未充分分开绳索"
      ],
      alternatives: ["tricep_pushdown", "overhead_tricep_extension", "skull_crusher"]
    },
    {
      id: "zottman_curl",
      name: "佐特曼弯举",
      part: "手臂",
      equipment: "哑铃",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E4%BD%90%E7%89%B9%E6%9B%BC%E5%BC%AF%E4%B8%BE%E6%95%99%E5%AD%A6",
      instructions: [
        "双手各持哑铃自然垂于身体两侧，掌心朝前",
        "双脚与肩同宽站立，核心收紧",
        "吸气，屈肘将哑铃向上弯举",
        "举至顶端时旋转手腕，掌心朝下",
        "呼气，控制哑铃以掌心朝下的方式下放",
        "下放至底端时旋转手腕回到掌心朝前"
      ],
      commonMistakes: [
        "借助身体摆动",
        "旋转手腕时机不当",
        "动作速度过快"
      ],
      alternatives: ["dumbbell_curl", "hammer_curl", "reverse_curl"]
    },
    {
      id: "bench_dips",
      name: "凳上臂屈伸",
      part: "手臂",
      equipment: "自重",
      difficulty: "初级",
      videoUrl: "https://www.douyin.com/search/%E5%87%B3%E4%B8%8A%E8%87%82%E5%B1%88%E4%BC%B8%E6%95%99%E5%AD%A6",
      instructions: [
        "双手撑于平凳边缘，手指朝前",
        "双腿向前伸直，脚跟着地",
        "臀部悬空，身体下降",
        "吸气，屈肘将身体下放",
        "下放至大臂与地面平行",
        "呼气，伸肘将身体推起"
      ],
      commonMistakes: [
        "下降幅度不足",
        "耸肩",
        "臀部过度下沉"
      ],
      alternatives: ["dips", "tricep_pushdown", "close_grip_bench_press"]
    },
    {
      id: "spider_curl",
      name: "蜘蛛弯举",
      part: "手臂",
      equipment: "哑铃",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E8%9C%98%E8%9B%9B%E5%BC%AF%E4%B8%BE%E6%95%99%E5%AD%A6",
      instructions: [
        "俯卧于上斜卧推凳上，胸部贴紧凳面",
        "双手各持哑铃，手臂自然下垂",
        "掌心朝前，手肘微屈",
        "吸气，屈肘将哑铃向上弯举",
        "举至二头肌充分收缩",
        "呼气，控制哑铃缓慢下放"
      ],
      commonMistakes: [
        "胸部离开凳面借力",
        "耸肩",
        "动作速度过快"
      ],
      alternatives: ["preacher_curl", "concentration_curl", "incline_dumbbell_curl"]
    },
    {
      id: "close_grip_bench_press_arms",
      name: "窄距卧推",
      part: "手臂",
      equipment: "杠铃",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E7%AA%84%E8%B7%9D%E5%8D%A7%E6%8E%A8%E6%95%99%E5%AD%A6",
      instructions: [
        "平躺在卧推凳上，双手正握杠铃",
        "握距与肩同宽或略窄",
        "吸气，控制杠铃下降至胸部中下部",
        "下降时手肘贴近身体两侧",
        "呼气，用三头肌力量将杠铃推起",
        "推起至手臂伸直但不锁死"
      ],
      commonMistakes: [
        "握距过窄，增加手腕压力",
        "手肘过度外展",
        "推起时失去控制"
      ],
      alternatives: ["diamond_push_up", "tricep_pushdown", "skull_crusher"]
    },
    {
      id: "drag_curl",
      name: "拖拽弯举",
      part: "手臂",
      equipment: "杠铃",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E6%8B%96%E6%8B%BD%E5%BC%AF%E4%B8%BE%E6%95%99%E5%AD%A6",
      instructions: [
        "双脚与肩同宽站立，双手正握杠铃",
        "握距与肩同宽，手臂自然下垂",
        "核心收紧，肘部向后拉",
        "吸气，屈肘将杠铃沿身体向上拉起",
        "拉起时肘部向后上方移动",
        "呼气，控制杠铃缓慢下放"
      ],
      commonMistakes: [
        "肘部前移",
        "身体后仰借力",
        "耸肩"
      ],
      alternatives: ["barbell_curl", "dumbbell_curl", "cable_curl"]
    }
  ],

  // ========== 核心肌群 ==========
  core: [
    {
      id: "plank",
      name: "平板支撑",
      part: "核心",
      equipment: "自重",
      difficulty: "初级",
      videoUrl: "https://www.douyin.com/search/%E5%B9%B3%E6%9D%BF%E6%94%AF%E6%92%91%E6%95%99%E5%AD%A6",
      instructions: [
        "俯卧于地面，双手撑地，间距与肩同宽",
        "双脚脚尖着地，身体呈一条直线",
        "核心收紧，臀部不要塌陷或翘起",
        "头部保持中立位，目视地面",
        "保持均匀呼吸，不要憋气",
        "尽可能长时间保持这个姿势"
      ],
      commonMistakes: [
        "臀部塌陷或过度翘起",
        "头部过度抬起或下沉",
        "憋气"
      ],
      alternatives: ["forearm_plank", "side_plank", "mountain_climber"]
    },
    {
      id: "crunch",
      name: "卷腹",
      part: "核心",
      equipment: "自重",
      difficulty: "初级",
      videoUrl: "https://www.douyin.com/zhuanti/7440709573649958952",
      instructions: [
        "仰卧于地面，双膝弯曲，双脚平放",
        "双手轻放于耳侧或交叉于胸前",
        "核心收紧，下背部贴紧地面",
        "呼气，用腹部力量将上背部抬离地面",
        "抬起时下巴微收，不要用力拉头部",
        "吸气，控制缓慢下放至起始位置"
      ],
      commonMistakes: [
        "用力拉头部，增加颈部压力",
        "下背部离开地面",
        "借助惯性完成动作"
      ],
      alternatives: ["reverse_crunch", "bicycle_crunch", "leg_raise"]
    },
    {
      id: "russian_twist",
      name: "俄罗斯转体",
      part: "核心",
      equipment: "自重",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E4%BF%84%E7%BD%97%E6%96%AF%E8%BD%AC%E4%BD%93%E6%95%99%E5%AD%A6",
      instructions: [
        "坐于地面，双膝弯曲，双脚抬离地面",
        "身体略微后仰，保持背部挺直",
        "双手合十或持重物于胸前",
        "核心收紧，双脚稳定",
        "向一侧转动上身，然后转向另一侧",
        "保持匀速转动，控制节奏"
      ],
      commonMistakes: [
        "双脚着地借力",
        "转动幅度不足",
        "背部拱起"
      ],
      alternatives: ["side_plank", "wood_chop", "pallof_press"]
    },
    {
      id: "leg_raise",
      name: "举腿",
      part: "核心",
      equipment: "自重",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E4%B8%BE%E8%85%BF%E6%95%99%E5%AD%A6",
      instructions: [
        "仰卧于地面，双腿伸直，双手放于身体两侧",
        "下背部贴紧地面，核心收紧",
        "吸气，控制双腿向上抬起",
        "抬至双腿与地面垂直或接近垂直",
        "呼气，控制双腿缓慢下放",
        "下放至接近地面但不接触，保持张力"
      ],
      commonMistakes: [
        "下背部离开地面",
        "借助惯性摆动双腿",
        "下放时双腿接触地面"
      ],
      alternatives: ["hanging_leg_raise", "reverse_crunch", "flutter_kick"]
    },
    {
      id: "mountain_climber",
      name: "登山者",
      part: "核心",
      equipment: "自重",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E7%99%BB%E5%B1%B1%E8%80%85%E6%95%99%E5%AD%A6",
      instructions: [
        "俯卧撑姿势，双手撑地，手臂伸直",
        "身体呈一条直线，核心收紧",
        "快速交替将双膝向胸部方向提起",
        "保持臀部稳定，不要过度起伏",
        "保持均匀呼吸",
        "保持快节奏持续进行"
      ],
      commonMistakes: [
        "臀部过度起伏",
        "动作速度过慢",
        "背部拱起"
      ],
      alternatives: ["high_knees", "burpees", "plank_jack"]
    },
    {
      id: "dead_bug",
      name: "死虫式",
      part: "核心",
      equipment: "自重",
      difficulty: "初级",
      videoUrl: "https://www.douyin.com/search/%E6%AD%BB%E8%99%AB%E5%BC%8F%E6%95%99%E5%AD%A6",
      instructions: [
        "仰卧于地面，双臂向上伸直指向天花板",
        "双膝弯曲90度，大腿垂直于地面",
        "下背部贴紧地面，核心收紧",
        "吸气，同时将对侧手臂和腿伸直下放",
        "下放至接近地面但不接触",
        "呼气，回到起始位置，换另一侧"
      ],
      commonMistakes: [
        "下背部离开地面",
        "下放时手臂或腿接触地面",
        "动作速度过快"
      ],
      alternatives: ["bird_dog", "plank", "hollow_body_hold"]
    },
    {
      id: "side_plank",
      name: "侧平板支撑",
      part: "核心",
      equipment: "自重",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E4%BE%A7%E5%B9%B3%E6%9D%BF%E6%94%AF%E6%92%91%E6%95%99%E5%AD%A6",
      instructions: [
        "侧卧于地面，一侧手肘撑地",
        "肘部位于肩部正下方",
        "双腿伸直，双脚叠放",
        "核心收紧，将臀部抬离地面",
        "身体呈一条直线，不要塌陷",
        "保持姿势，然后换另一侧"
      ],
      commonMistakes: [
        "臀部塌陷",
        "身体旋转",
        "憋气"
      ],
      alternatives: ["plank", "russian_twist", "side_crunch"]
    },
    {
      id: "hanging_leg_raise",
      name: "悬垂举腿",
      part: "核心",
      equipment: "自重",
      difficulty: "高级",
      videoUrl: "https://www.douyin.com/search/%E6%82%AC%E5%9E%82%E4%B8%BE%E8%85%BF%E6%95%99%E5%AD%A6",
      instructions: [
        "双手握住单杠，身体自然悬垂",
        "核心收紧，双腿伸直或微屈",
        "吸气，控制双腿向上抬起",
        "抬至双腿与地面平行或更高",
        "呼气，控制双腿缓慢下放",
        "保持身体稳定，不要摆动"
      ],
      commonMistakes: [
        "借助身体摆动完成动作",
        "下放时速度过快",
        "耸肩"
      ],
      alternatives: ["captains_chair_leg_raise", "lying_leg_raise", "reverse_crunch"]
    },
    {
      id: "ab_wheel_rollout",
      name: "健腹轮",
      part: "核心",
      equipment: "器械",
      difficulty: "高级",
      videoUrl: "https://www.douyin.com/search/%E5%81%A5%E8%85%B9%E8%BD%AE%E6%95%99%E5%AD%A6",
      instructions: [
        "双膝跪地，双手握住健腹轮",
        "核心收紧，背部保持平直",
        "吸气，缓慢向前滚动健腹轮",
        "滚动至身体接近地面，保持张力",
        "呼气，用核心力量将健腹轮拉回",
        "回到起始跪姿位置"
      ],
      commonMistakes: [
        "臀部过度翘起",
        "背部拱起",
        "滚动幅度过大导致无法控制"
      ],
      alternatives: ["plank", "hollow_body_hold", "dragon_flag"]
    },
    {
      id: "bicycle_crunch",
      name: "自行车卷腹",
      part: "核心",
      equipment: "自重",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E8%87%AA%E8%A1%8C%E8%BD%A6%E5%8D%B7%E8%85%B9%E6%95%99%E5%AD%A6",
      instructions: [
        "仰卧于地面，双手轻放于耳侧",
        "双腿抬起，双膝弯曲90度",
        "核心收紧，下背部贴地",
        "对侧肘部与膝盖相触，同时伸直另一条腿",
        "快速交替进行，像蹬自行车一样",
        "保持均匀呼吸"
      ],
      commonMistakes: [
        "用力拉头部",
        "动作速度过慢",
        "下背部离开地面"
      ],
      alternatives: ["crunch", "russian_twist", "mountain_climber"]
    },
    {
      id: "wood_chop",
      name: "伐木式",
      part: "核心",
      equipment: "绳索",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E4%BC%90%E6%9C%A8%E5%BC%8F%E6%95%99%E5%AD%A6",
      instructions: [
        "将滑轮调至高位，双手握住绳索或把手",
        "侧身站立，双手举过头顶",
        "核心收紧，双脚站稳",
        "将绳索从高处向对侧髋部方向拉动",
        "转动身体，用核心发力",
        "控制缓慢回至起始位置，完成一侧后换边"
      ],
      commonMistakes: [
        "仅用手臂发力",
        "身体不稳",
        "动作速度过快"
      ],
      alternatives: ["russian_twist", "pallof_press", "side_plank"]
    },
    {
      id: "pallof_press",
      name: "帕洛夫推举",
      part: "核心",
      equipment: "绳索",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E5%B8%95%E6%B4%9B%E5%A4%AB%E6%8E%A8%E4%B8%BE%E6%95%99%E5%AD%A6",
      instructions: [
        "将滑轮调至与胸部平齐，侧身站立",
        "双手握住绳索把手，拉至胸前",
        "核心收紧，双脚与肩同宽站立",
        "保持身体稳定，将绳索向前推出",
        "推出时身体不要旋转",
        "控制缓慢回至胸前，完成一侧后换边"
      ],
      commonMistakes: [
        "身体旋转借力",
        "耸肩",
        "核心未收紧"
      ],
      alternatives: ["wood_chop", "side_plank", "russian_twist"]
    },
    {
      id: "dragon_flag",
      name: "龙旗",
      part: "核心",
      equipment: "自重",
      difficulty: "高级",
      videoUrl: "https://www.douyin.com/search/%E9%BE%99%E6%97%97%E6%95%99%E5%AD%A6",
      instructions: [
        "仰卧于平凳上，双手抓住凳头",
        "双腿伸直抬起，身体呈直线",
        "核心收紧，全身保持刚性",
        "控制身体缓慢下放，保持直线",
        "下放至接近凳面但不接触",
        "用核心力量将身体抬回起始位置"
      ],
      commonMistakes: [
        "身体弯曲失去直线",
        "下放时速度过快",
        "借助手臂过度发力"
      ],
      alternatives: ["hanging_leg_raise", "ab_wheel_rollout", "hollow_body_hold"]
    },
    {
      id: "hollow_body_hold",
      name: "空心体保持",
      part: "核心",
      equipment: "自重",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E7%A9%BA%E5%BF%83%E4%BD%93%E4%BF%9D%E6%8C%81%E6%95%99%E5%AD%A6",
      instructions: [
        "仰卧于地面，双臂向上伸直",
        "双腿伸直抬起，同时上背部抬离地面",
        "腰部贴紧地面，身体呈香蕉形状",
        "核心收紧，保持这个姿势",
        "保持均匀呼吸",
        "尽可能长时间保持"
      ],
      commonMistakes: [
        "腰部离开地面",
        "头部过度抬起",
        "憋气"
      ],
      alternatives: ["plank", "dead_bug", "leg_raise"]
    },
    {
      id: "reverse_crunch",
      name: "反向卷腹",
      part: "核心",
      equipment: "自重",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E5%8F%8D%E5%90%91%E5%8D%B7%E8%85%B9%E6%95%99%E5%AD%A6",
      instructions: [
        "仰卧于地面，双腿抬起，双膝弯曲",
        "双手放于身体两侧或臀下",
        "核心收紧，下背部贴地",
        "吸气，用下腹部力量将骨盆向上抬起",
        "抬起时膝盖向胸部方向移动",
        "呼气，控制缓慢下放"
      ],
      commonMistakes: [
        "借助惯性摆动",
        "下背部离开地面",
        "动作速度过快"
      ],
      alternatives: ["leg_raise", "crunch", "hanging_leg_raise"]
    },
    {
      id: "flutter_kick",
      name: "交替打腿",
      part: "核心",
      equipment: "自重",
      difficulty: "中级",
      videoUrl: "https://www.douyin.com/search/%E4%BA%A4%E6%9B%BF%E6%89%93%E8%85%BF%E6%95%99%E5%AD%A6",
      instructions: [
        "仰卧于地面，双腿伸直抬起",
        "上背部略微抬离地面，双手放于臀下",
        "核心收紧，下背部贴地",
        "双腿交替上下摆动，像游泳打腿",
        "保持匀速，控制节奏",
        "保持均匀呼吸"
      ],
      commonMistakes: [
        "下背部离开地面",
        "摆动幅度过大",
        "憋气"
      ],
      alternatives: ["leg_raise", "scissor_kick", "mountain_climber"]
    },
    {
      id: "bird_dog",
      name: "鸟狗式",
      part: "核心",
      equipment: "自重",
      difficulty: "初级",
      videoUrl: "https://www.douyin.com/search/%E9%B8%9F%E7%8B%97%E5%BC%8F%E6%95%99%E5%AD%A6",
      instructions: [
        "四点跪姿，双手位于肩部正下方",
        "双膝位于髋部正下方",
        "核心收紧，背部保持平直",
        "同时伸直对侧手臂和腿",
        "保持身体稳定，不要旋转",
        "保持片刻后换另一侧"
      ],
      commonMistakes: [
        "身体旋转",
        "背部拱起或塌陷",
        "头部过度抬起"
      ],
      alternatives: ["dead_bug", "plank", "hollow_body_hold"]
    }
  ]
};

// ========== 工具函数 ==========

/**
 * 按肌群获取动作
 * @param {string} muscle - 肌群名称（英文：chest/back/legs/shoulders/arms/core）
 * @returns {Array} 该肌群的所有动作
 */
function getExercisesByMuscle(muscle) {
  const muscleKey = muscle.toLowerCase();
  if (exerciseDatabase[muscleKey]) {
    return exerciseDatabase[muscleKey];
  }
  // 尝试中文匹配
  const muscleMap = {
    "胸部": "chest",
    "背部": "back",
    "腿部": "legs",
    "肩部": "shoulders",
    "手臂": "arms",
    "核心": "core"
  };
  if (muscleMap[muscle]) {
    return exerciseDatabase[muscleMap[muscle]];
  }
  return [];
}

/**
 * 按器械获取动作
 * @param {string} equipment - 器械名称（杠铃/哑铃/器械/自重/绳索/壶铃）
 * @returns {Array} 使用该器械的所有动作
 */
function getExercisesByEquipment(equipment) {
  const allExercises = Object.values(exerciseDatabase).flat();
  return allExercises.filter(exercise => exercise.equipment === equipment);
}

/**
 * 搜索动作
 * @param {string} keyword - 搜索关键词
 * @returns {Array} 匹配的动作列表
 */
function searchExercises(keyword) {
  if (!keyword || keyword.trim() === "") {
    return [];
  }
  
  const searchTerm = keyword.toLowerCase().trim();
  const allExercises = Object.values(exerciseDatabase).flat();
  
  return allExercises.filter(exercise => {
    // 搜索动作名称（支持中英文，不区分大小写）
    if (exercise.name.toLowerCase().includes(searchTerm) || exercise.name.includes(keyword)) {
      return true;
    }
    // 搜索ID
    if (exercise.id.toLowerCase().includes(searchTerm)) {
      return true;
    }
    // 搜索肌群（支持中英文）
    if (exercise.part.toLowerCase().includes(searchTerm) || exercise.part.includes(keyword)) {
      return true;
    }
    // 搜索器械（支持中英文）
    if (exercise.equipment.toLowerCase().includes(searchTerm) || exercise.equipment.includes(keyword)) {
      return true;
    }
    // 搜索难度（支持中英文）
    if (exercise.difficulty.toLowerCase().includes(searchTerm) || exercise.difficulty.includes(keyword)) {
      return true;
    }
    // 搜索动作要领（支持中英文）
    if (exercise.instructions.some(inst => inst.toLowerCase().includes(searchTerm) || inst.includes(keyword))) {
      return true;
    }
    return false;
  });
}

/**
 * 按ID获取动作
 * @param {string} id - 动作唯一标识
 * @returns {Object|null} 动作对象，未找到返回null
 */
function getExerciseById(id) {
  const allExercises = Object.values(exerciseDatabase).flat();
  return allExercises.find(exercise => exercise.id === id) || null;
}

/**
 * 获取所有动作统计信息
 * @returns {Object} 统计信息
 */
function getExerciseStats() {
  const stats = {
    total: 0,
    byMuscle: {},
    byEquipment: {}
  };
  
  const muscleNames = {
    chest: "胸部",
    back: "背部",
    legs: "腿部",
    shoulders: "肩部",
    arms: "手臂",
    core: "核心"
  };
  
  for (const [muscle, exercises] of Object.entries(exerciseDatabase)) {
    const count = exercises.length;
    stats.total += count;
    stats.byMuscle[muscleNames[muscle]] = count;
    
    for (const exercise of exercises) {
      const equip = exercise.equipment;
      stats.byEquipment[equip] = (stats.byEquipment[equip] || 0) + 1;
    }
  }
  
  return stats;
}

// ES6 模块化导出
export {
  exerciseDatabase,
  getExercisesByMuscle,
  getExercisesByEquipment,
  searchExercises,
  getExerciseById,
  getExerciseStats
};

// 默认导出整个数据库
export default exerciseDatabase;
