/* =========================================================
   Self Recovery System
   File: js/data.js
   Purpose: 初始数据、分类常量、localStorage key
   ========================================================= */


/* =========================
   1. 应用版本与 localStorage Keys
   ========================= */

const APP_VERSION = "1.0.0";

const STORAGE_KEYS = {
  tasks: "selfRecoveryTasks",
  routines: "selfRecoveryRoutines",
  notes: "selfRecoveryNotes",
  weeklyPlan: "selfRecoveryWeeklyPlan",
  weeklyReview: "selfRecoveryWeeklyReview"
};


/* =========================
   2. 分类常量
   ========================= */

const CATEGORIES = {
  study: "学习",
  project: "项目",
  reading: "阅读",
  health: "健康",
  creation: "创作",
  life: "生活",
  recovery: "恢复",
  admin: "事务"
};

const CATEGORY_LABELS_EN = {
  study: "STUDY",
  project: "PROJECT",
  reading: "READ",
  health: "HEALTH",
  creation: "CREATE",
  life: "LIFE",
  recovery: "REST",
  admin: "ADMIN"
};

const CATEGORY_TAG_CLASSES = {
  study: "tag-study",
  project: "tag-project",
  reading: "tag-reading",
  health: "tag-health",
  creation: "tag-creation",
  life: "tag-life",
  recovery: "tag-recovery",
  admin: "tag-admin"
};


/* =========================
   3. 任务状态
   ========================= */

const TASK_STATUS = {
  todo: "未开始",
  doing: "进行中",
  done: "已完成",
  paused: "暂停",
  cancelled: "取消",
  postponed: "已延期"
};


/* =========================
   4. 能量等级
   ========================= */

const ENERGY_LEVELS = {
  low: "LOW",
  medium: "MID",
  high: "HIGH"
};


/* =========================
   5. 时间段
   ========================= */

const TIME_BLOCKS = {
  morning: "上午",
  afternoon: "下午",
  evening: "晚上",
  night: "夜间",
  flexible: "灵活"
};


/* =========================
   6. 今日类型
   ========================= */

const DAY_TYPES = {
  high_pressure: {
    label: "高压补漏日",
    strategy: "只保底，不扩张"
  },
  normal: {
    label: "普通推进日",
    strategy: "完成必做，再看可选"
  },
  recovery: {
    label: "低压恢复日",
    strategy: "恢复秩序，不硬冲"
  },
  focus: {
    label: "专注推进日",
    strategy: "减少切换，完成一个重点"
  },
  rest: {
    label: "完全休息日",
    strategy: "不安排硬任务"
  }
};


/* =========================
   7. 随记标签
   ========================= */

const NOTE_TAGS = {
  emotion: "情绪",
  idea: "灵感",
  life: "生活",
  study: "学习",
  creation: "创作",
  body: "身体",
  later: "待整理",
  daily: "今日"
};


/* =========================
   8. 默认今日状态
   ========================= */

const DEFAULT_TODAY = {
  weekNumber: 1,
  weekday: "周一",
  dayType: "normal"
};


/* =========================
   9. 默认本周计划：公开仓库示例数据，不包含个人真实记录
   ========================= */

const DEFAULT_WEEKLY_PLAN = {
  id: 1,
  weekNumber: 1,
  title: "示例周计划：恢复秩序与小步推进",
  theme: "最低完成线优先",
  pressureLevel: "MID",
  startDate: "01/01",
  endDate: "01/07",
  rawOutline:
`示例周计划：恢复秩序与小步推进

核心原则：
1. 每天先确定最低完成线。
2. 高能量时推进重点任务，低能量时做维护动作。
3. 身体、睡眠和饮食属于系统底座，不用靠意志力硬扛。
4. 计划被打断时，先重启，不补罚。`,
  days: [
    {
      id: "mon",
      title: "周一",
      items: [
        { timeBlock: "上午", text: "确定本周最低完成线" },
        { timeBlock: "下午", text: "推进一个学习或项目任务" },
        { timeBlock: "晚上", text: "轻复盘，准备睡前收尾" }
      ]
    },
    {
      id: "tue",
      title: "周二",
      items: [
        { timeBlock: "上午", text: "处理一个重要不紧急任务" },
        { timeBlock: "下午", text: "整理任务列表，删除不必要事项" },
        { timeBlock: "晚上", text: "散步或拉伸" }
      ]
    },
    {
      id: "wed",
      title: "周三",
      items: [
        { timeBlock: "上午", text: "完成一段专注工作" },
        { timeBlock: "下午", text: "记录卡住的地方" },
        { timeBlock: "晚上", text: "低压阅读或休息" }
      ]
    },
    {
      id: "thu",
      title: "周四",
      items: [
        { timeBlock: "上午", text: "复盘本周进度" },
        { timeBlock: "下午", text: "补一个小缺口" },
        { timeBlock: "晚上", text: "整理第二天要做的第一步" }
      ]
    },
    {
      id: "fri",
      title: "周五",
      items: [
        { timeBlock: "上午", text: "完成本周核心任务的一小块" },
        { timeBlock: "下午", text: "归档随记与待办" },
        { timeBlock: "晚上", text: "提前收尾，不临时扩张" }
      ]
    },
    {
      id: "sat",
      title: "周六",
      items: [
        { timeBlock: "上午", text: "轻量整理环境" },
        { timeBlock: "下午", text: "出门、运动或休息" },
        { timeBlock: "晚上", text: "只做低压维护" }
      ]
    },
    {
      id: "sun",
      title: "周日",
      items: [
        { timeBlock: "上午", text: "周复盘" },
        { timeBlock: "下午", text: "完整休息" },
        { timeBlock: "晚上", text: "写下下周第一步" }
      ]
    }
  ]
};


/* =========================
   10. 默认任务：公开仓库示例数据
   ========================= */

const DEFAULT_TASKS = [
  {
    id: 1,
    title: "写下今日最低完成线",
    description: "只写 1-3 件今天必须完成的小事，避免把计划做成审判清单。",
    category: "recovery",
    quadrant: 1,
    status: "todo",
    importance: 5,
    urgency: 5,
    deadline: "",
    taskDate: "",
    timeBlock: "morning",
    energyLevel: "low",
    estimatedMinutes: 10,
    source: "weekly_plan",
    showToday: true,
    showWeekly: true,
    isTodayMust: true,
    createdAt: "2026-01-01T09:00:00"
  },
  {
    id: 2,
    title: "推进一个学习或项目任务",
    description: "先做最小可启动版本，例如打开材料、列出问题、完成 25 分钟专注。",
    category: "study",
    quadrant: 2,
    status: "todo",
    importance: 4,
    urgency: 3,
    deadline: "",
    taskDate: "",
    timeBlock: "afternoon",
    energyLevel: "medium",
    estimatedMinutes: 30,
    source: "weekly_plan",
    showToday: true,
    showWeekly: true,
    isTodayMust: true,
    createdAt: "2026-01-01T09:05:00"
  },
  {
    id: 3,
    title: "散步或拉伸 20 分钟",
    description: "低能量时只做散步；高能量时可以替换成正式运动。",
    category: "health",
    quadrant: 2,
    status: "todo",
    importance: 4,
    urgency: 2,
    deadline: "",
    taskDate: "",
    timeBlock: "evening",
    energyLevel: "low",
    estimatedMinutes: 20,
    source: "manual",
    showToday: true,
    showWeekly: true,
    isTodayMust: false,
    createdAt: "2026-01-01T09:10:00"
  },
  {
    id: 4,
    title: "把一条随记整理成任务",
    description: "从随记里挑一条真正需要行动的内容，转成一个有第一步的任务。",
    category: "life",
    quadrant: 3,
    status: "todo",
    importance: 3,
    urgency: 4,
    deadline: "",
    taskDate: "",
    timeBlock: "flexible",
    energyLevel: "low",
    estimatedMinutes: 15,
    source: "manual",
    showToday: false,
    showWeekly: true,
    isTodayMust: false,
    createdAt: "2026-01-01T09:15:00"
  }
];


/* =========================
   11. 默认连击挑战：公开仓库示例数据
   ========================= */

const DEFAULT_ROUTINES = [
  {
    id: 1,
    title: "睡前收尾",
    category: "recovery",
    frequency: "daily",
    currentStreak: 0,
    bestStreak: 0,
    isDoneToday: false,
    allowFreeze: true,
    weeklyFreezeUsed: 0,
    weeklyFreezeLimit: 1
  },
  {
    id: 2,
    title: "喝水 1.5L",
    category: "health",
    frequency: "daily",
    currentStreak: 0,
    bestStreak: 0,
    isDoneToday: false,
    allowFreeze: false,
    weeklyFreezeUsed: 0,
    weeklyFreezeLimit: 0
  },
  {
    id: 3,
    title: "10 分钟整理",
    category: "life",
    frequency: "daily",
    currentStreak: 0,
    bestStreak: 0,
    isDoneToday: false,
    allowFreeze: true,
    weeklyFreezeUsed: 0,
    weeklyFreezeLimit: 1
  },
  {
    id: 4,
    title: "运动或散步",
    category: "health",
    frequency: "daily",
    currentStreak: 0,
    bestStreak: 0,
    isDoneToday: false,
    allowFreeze: true,
    weeklyFreezeUsed: 0,
    weeklyFreezeLimit: 1
  }
];


/* =========================
   12. 默认随记：公开仓库示例数据
   ========================= */

const DEFAULT_NOTES = [
  {
    id: 1,
    content: "今天先完成最低线，不把一整天判定为失败。",
    tag: "emotion",
    mood: "",
    isArchived: false,
    convertedTaskId: null,
    createdAt: "2026-01-01T21:00:00"
  },
  {
    id: 2,
    content: "把混乱写下来，再决定它是不是任务。",
    tag: "idea",
    mood: "",
    isArchived: false,
    convertedTaskId: null,
    createdAt: "2026-01-01T21:05:00"
  }
];


/* =========================
   13. 默认周复盘
   ========================= */

const DEFAULT_WEEKLY_REVIEW = {
  text: "",
  postponedCount: 0
};


/* =========================
   14. 工具函数：深拷贝默认数据
   ========================= */

function cloneDefaultData(data) {
  return JSON.parse(JSON.stringify(data));
}


/* =========================
   15. 工具函数：象限判断
   ========================= */

function getQuadrantByScore(importance, urgency) {
  const imp = Number(importance);
  const urg = Number(urgency);

  if (imp >= 4 && urg >= 4) return 1;
  if (imp >= 4 && urg < 4) return 2;
  if (imp < 4 && urg >= 4) return 3;
  return 4;
}


/* =========================
   16. 工具函数：生成 ID
   ========================= */

function createId(prefix = "") {
  const base = Date.now();
  const random = Math.floor(Math.random() * 10000);

  if (prefix) {
    return `${prefix}_${base}_${random}`;
  }

  return base + random;
}
