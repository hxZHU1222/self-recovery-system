/* =========================================================
   Self Recovery System
   File: js/main.js
   Purpose: 页面渲染、交互、localStorage
   ========================================================= */


/* =========================
   1. 应用状态
   ========================= */

const appState = {
  currentPage: "today",
  previousPage: "today",
  selectedNoteTag: "emotion",
  selectedTaskCategory: "study",
  selectedImportance: 3,
  selectedUrgency: 3,
  selectedEstimatedMinutes: 30,
  selectedEnergyLevel: "medium",
  fromNoteId: null,

  tasks: [],
  routines: [],
  notes: [],
  weeklyPlan: null,
  weeklyReview: null
};


/* =========================
   2. DOM 获取工具
   ========================= */

function $(selector) {
  return document.querySelector(selector);
}

function $all(selector) {
  return Array.from(document.querySelectorAll(selector));
}


/* =========================
   3. localStorage 工具
   ========================= */

function readStorage(key, fallback) {
  const raw = localStorage.getItem(key);

  if (!raw) {
    return cloneDefaultData(fallback);
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn(`读取 ${key} 失败，使用默认数据。`, error);
    return cloneDefaultData(fallback);
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function saveAll() {
  writeStorage(STORAGE_KEYS.tasks, appState.tasks);
  writeStorage(STORAGE_KEYS.routines, appState.routines);
  writeStorage(STORAGE_KEYS.notes, appState.notes);
  writeStorage(STORAGE_KEYS.weeklyPlan, appState.weeklyPlan);
  writeStorage(STORAGE_KEYS.weeklyReview, appState.weeklyReview);
}


/* =========================
   4. 初始化
   ========================= */

document.addEventListener("DOMContentLoaded", initApp);

function initApp() {
  loadState();
  bindGlobalEvents();
  bindChoiceGroups();
  renderAll();
}

function loadState() {
  appState.tasks = readStorage(STORAGE_KEYS.tasks, DEFAULT_TASKS);
  appState.routines = readStorage(STORAGE_KEYS.routines, DEFAULT_ROUTINES);
  appState.notes = readStorage(STORAGE_KEYS.notes, DEFAULT_NOTES);
  appState.weeklyPlan = readStorage(STORAGE_KEYS.weeklyPlan, DEFAULT_WEEKLY_PLAN);
  appState.weeklyReview = readStorage(STORAGE_KEYS.weeklyReview, DEFAULT_WEEKLY_REVIEW);
}


/* =========================
   5. 全局事件绑定
   ========================= */

function bindGlobalEvents() {
  $all(".nav-button").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.target;
      showPage(target);
    });
  });

  $("#floatingAddBtn").addEventListener("click", () => {
    openNewTaskPage();
  });

  $("#cancelNewTaskBtn").addEventListener("click", () => {
    closeNewTaskPage();
  });

  $("#newTaskForm").addEventListener("submit", handleNewTaskSubmit);

  $("#saveQuickNoteBtn").addEventListener("click", handleSaveQuickNote);
  $("#saveDailyNoteBtn").addEventListener("click", handleSaveDailyNote);

  $("#toggleWeeklyOutlineBtn").addEventListener("click", toggleWeeklyOutline);
  $("#saveWeeklyOutlineBtn").addEventListener("click", handleSaveWeeklyOutline);
  $("#saveWeeklyReviewBtn").addEventListener("click", handleSaveWeeklyReview);

  $("#addWeeklyTaskBtn").addEventListener("click", () => {
    openNewTaskPage({ showWeekly: true });
  });

  const exportDataBtn = $("#exportDataBtn");
  if (exportDataBtn) {
    exportDataBtn.addEventListener("click", handleExportData);
  }

  const importDataInput = $("#importDataInput");
  if (importDataInput) {
    importDataInput.addEventListener("change", handleImportData);
  }

  const resetDemoDataBtn = $("#resetDemoDataBtn");
  if (resetDemoDataBtn) {
    resetDemoDataBtn.addEventListener("click", handleResetDemoData);
  }
}


/* =========================
   6. 选择按钮组
   ========================= */

function bindChoiceGroups() {
  bindChoiceGroup("#noteTagGrid", "selectedNoteTag");
  bindChoiceGroup("#taskCategoryGrid", "selectedTaskCategory");
  bindChoiceGroup("#importanceGrid", "selectedImportance", Number);
  bindChoiceGroup("#urgencyGrid", "selectedUrgency", Number);
  bindChoiceGroup("#estimatedMinutesGrid", "selectedEstimatedMinutes", Number);
  bindChoiceGroup("#energyGrid", "selectedEnergyLevel");
}

function bindChoiceGroup(containerSelector, stateKey, transform = (value) => value) {
  const container = $(containerSelector);
  if (!container) return;

  container.addEventListener("click", (event) => {
    const button = event.target.closest(".choice");
    if (!button) return;

    event.preventDefault();

    container.querySelectorAll(".choice").forEach((item) => {
      item.classList.remove("active");
    });

    button.classList.add("active");
    appState[stateKey] = transform(button.dataset.value || button.dataset.noteTag);
  });
}


/* =========================
   7. 页面切换
   ========================= */

function showPage(pageName) {
  appState.previousPage = appState.currentPage;
  appState.currentPage = pageName;

  $all(".page").forEach((page) => {
    page.classList.remove("page-active");
  });

  const targetPage = $(`#page-${pageName}`);
  if (targetPage) {
    targetPage.classList.add("page-active");
  }

  $all(".nav-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.target === pageName);
  });

  updateHeaderSubtitle(pageName);

  window.scrollTo({
    top: 0,
    behavior: "auto"
  });
}

function updateHeaderSubtitle(pageName) {
  const subtitleMap = {
    today: "TODAY BOARD",
    weekly: "WEEKLY PLAN",
    matrix: "TASK MATRIX",
    routines: "STREAK BOOK",
    notes: "NOTE BOARD",
    data: "DATA / BACKUP",
    "new-task": "NEW TASK"
  };

  $("#appSubtitle").textContent = subtitleMap[pageName] || "LIFE RECOVERY";
}

function openNewTaskPage(options = {}) {
  appState.previousPage = appState.currentPage;

  resetNewTaskForm();

  if (options.showWeekly) {
    $("#taskShowWeekly").checked = true;
  }

  if (options.showToday) {
    $("#taskShowToday").checked = true;
  }

  if (options.isTodayMust) {
    $("#taskIsTodayMust").checked = true;
  }

  if (options.description) {
    $("#taskDescription").value = options.description;
  }

  if (options.fromNoteId) {
    appState.fromNoteId = options.fromNoteId;
  }

  showPage("new-task");
}

function closeNewTaskPage() {
  const backTo = appState.previousPage || "today";
  appState.fromNoteId = null;
  showPage(backTo);
}


/* =========================
   8. 总渲染
   ========================= */

function renderAll() {
  renderTodayHeader();
  renderTodayTasks();
  renderTodayRoutines();
  renderWeeklyPlan();
  renderMatrix();
  renderRoutines();
  renderNotes();
  renderWeeklyReview();
}


/* =========================
   9. 今日页渲染
   ========================= */

function renderTodayHeader() {
  const today = DEFAULT_TODAY;
  const dayType = DAY_TYPES[today.dayType] || DAY_TYPES.normal;

  $("#todayWeekNumber").textContent = today.weekNumber;
  $("#todayWeekday").textContent = today.weekday;
  $("#todayType").textContent = dayType.label;
  $("#todayStrategy").textContent = dayType.strategy;
}

function renderTodayTasks() {
  const mustTasks = appState.tasks.filter((task) => {
    return task.showToday && task.isTodayMust && task.status !== "cancelled";
  });

  const optionalTasks = appState.tasks.filter((task) => {
    return task.showToday && !task.isTodayMust && task.status !== "cancelled";
  });

  renderTaskList("#todayMustList", mustTasks, {
    emptyText: "今天没有被安排的必做任务。可以先添加一个很小的任务。",
    compact: false
  });

  renderTaskList("#todayOptionalList", optionalTasks, {
    emptyText: "今天没有可选任务。这样也很好。",
    compact: false
  });
}

function renderTodayRoutines() {
  const container = $("#todayRoutineList");
  const routines = appState.routines.slice(0, 4);

  if (routines.length === 0) {
    container.innerHTML = `<div class="empty-state"><p>还没有设置连击挑战。</p></div>`;
    return;
  }

  container.innerHTML = routines.map((routine) => {
    return `
      <div class="routine-row" data-routine-id="${routine.id}">
        <span class="routine-name">${escapeHtml(routine.title)}</span>
        <span class="routine-days">${routine.currentStreak} DAYS</span>
      </div>
    `;
  }).join("");
}


/* =========================
   10. 任务列表渲染
   ========================= */

function renderTaskList(containerSelector, tasks, options = {}) {
  const container = $(containerSelector);
  if (!container) return;

  if (!tasks || tasks.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>${options.emptyText || "这里暂时没有任务。"}</p>
      </div>
    `;
    return;
  }

  const wrapperClass = options.compact ? "compact-task-list" : "";

  container.innerHTML = `
    <div class="${wrapperClass}">
      ${tasks.map((task) => createTaskItemHtml(task)).join("")}
    </div>
  `;

  bindTaskItemEvents(container);
}

function createTaskItemHtml(task) {
  const isDone = task.status === "done";
  const categoryText = CATEGORY_LABELS_EN[task.category] || "TASK";
  const categoryClass = CATEGORY_TAG_CLASSES[task.category] || "";
  const energyText = ENERGY_LEVELS[task.energyLevel] || "MID";
  const timeText = `${task.estimatedMinutes || 30} MIN`;

  return `
    <div class="task-item ${isDone ? "task-done" : ""}" data-task-id="${task.id}">
      <div class="task-main">
        <span class="task-check" role="button" aria-label="切换任务完成状态"></span>
        <span class="task-title">${escapeHtml(task.title)}</span>
      </div>

      <div class="task-meta">
        <span class="tag ${categoryClass}">${categoryText}</span>
        <span class="tag">${timeText}</span>
        <span class="tag">${energyText}</span>
      </div>

      <div class="task-detail hidden">
        <p>说明：${escapeHtml(task.description || "暂无说明。")}</p>
        <p>截止：<span class="date">${task.deadline || "未设置"}</span></p>
        <p>来源：${formatSource(task.source)}</p>
        <p>重要：<span class="num">${task.importance}</span> / 紧急：<span class="num">${task.urgency}</span></p>

        <div class="task-detail-actions">
          <button class="flat-button small task-done-btn" type="button">今天完成了</button>
          <button class="flat-button small task-postpone-btn" type="button">明天再处理</button>
          <button class="flat-button small task-today-btn" type="button">加入今日</button>
        </div>
      </div>
    </div>
  `;
}

function bindTaskItemEvents(container) {
  container.querySelectorAll(".task-item").forEach((item) => {
    const taskId = getTaskId(item);

    const check = item.querySelector(".task-check");
    const title = item.querySelector(".task-title");
    const doneBtn = item.querySelector(".task-done-btn");
    const postponeBtn = item.querySelector(".task-postpone-btn");
    const todayBtn = item.querySelector(".task-today-btn");

    check.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleTaskDone(taskId);
    });

    title.addEventListener("click", () => {
      toggleTaskDetail(item);
    });

    doneBtn.addEventListener("click", () => {
      markTaskDone(taskId);
    });

    postponeBtn.addEventListener("click", () => {
      postponeTask(taskId);
    });

    todayBtn.addEventListener("click", () => {
      addTaskToToday(taskId);
    });
  });
}

function getTaskId(taskElement) {
  const rawId = taskElement.dataset.taskId;
  const numericId = Number(rawId);

  return Number.isNaN(numericId) ? rawId : numericId;
}

function toggleTaskDetail(item) {
  const detail = item.querySelector(".task-detail");
  detail.classList.toggle("hidden");
}


/* =========================
   11. 任务操作
   ========================= */

function findTask(taskId) {
  return appState.tasks.find((task) => task.id === taskId);
}

function toggleTaskDone(taskId) {
  const task = findTask(taskId);
  if (!task) return;

  task.status = task.status === "done" ? "todo" : "done";
  saveAll();
  renderAll();

  if (task.status === "done") {
    showToast("已放入完成记录。", "success");
  }
}

function markTaskDone(taskId) {
  const task = findTask(taskId);
  if (!task) return;

  task.status = "done";
  saveAll();
  renderAll();
  showToast("已放入完成记录。", "success");
}

function postponeTask(taskId) {
  const task = findTask(taskId);
  if (!task) return;

  task.status = "postponed";
  task.showToday = false;
  task.isTodayMust = false;

  saveAll();
  renderAll();
  showToast("已放到之后处理。", "warning");
}

function addTaskToToday(taskId) {
  const task = findTask(taskId);
  if (!task) return;

  task.showToday = true;

  saveAll();
  renderAll();
  showToast("已经加入今日。", "success");
}


/* =========================
   12. 新增任务
   ========================= */

function handleNewTaskSubmit(event) {
  event.preventDefault();

  const title = $("#taskTitle").value.trim();

  if (!title) {
    $("#taskFormMessage").textContent = "先给这个任务起个名字。";
    return;
  }

  const importance = appState.selectedImportance;
  const urgency = appState.selectedUrgency;

  const newTask = {
    id: createId(),
    title,
    description: $("#taskDescription").value.trim(),
    category: appState.selectedTaskCategory,
    quadrant: getQuadrantByScore(importance, urgency),
    status: "todo",
    importance,
    urgency,
    deadline: $("#taskDeadline").value || "",
    taskDate: $("#taskShowToday").checked ? getTodayDateString() : "",
    timeBlock: "flexible",
    energyLevel: appState.selectedEnergyLevel,
    estimatedMinutes: appState.selectedEstimatedMinutes,
    source: appState.fromNoteId ? "note" : "manual",
    showToday: $("#taskShowToday").checked,
    showWeekly: $("#taskShowWeekly").checked,
    isTodayMust: $("#taskIsTodayMust").checked,
    createdAt: new Date().toISOString()
  };

  appState.tasks.unshift(newTask);

  if (appState.fromNoteId) {
    const note = appState.notes.find((item) => item.id === appState.fromNoteId);
    if (note) {
      note.convertedTaskId = newTask.id;
    }
    appState.fromNoteId = null;
  }

  saveAll();
  resetNewTaskForm();
  renderAll();
  showToast("任务已经保存下来。", "success");
  showPage(newTask.showToday ? "today" : "matrix");
}

function resetNewTaskForm() {
  $("#newTaskForm").reset();
  $("#taskFormMessage").textContent = "";

  appState.selectedTaskCategory = "study";
  appState.selectedImportance = 3;
  appState.selectedUrgency = 3;
  appState.selectedEstimatedMinutes = 30;
  appState.selectedEnergyLevel = "medium";

  resetChoiceGroup("#taskCategoryGrid", "study");
  resetChoiceGroup("#importanceGrid", "3");
  resetChoiceGroup("#urgencyGrid", "3");
  resetChoiceGroup("#estimatedMinutesGrid", "30");
  resetChoiceGroup("#energyGrid", "medium");
}

function resetChoiceGroup(containerSelector, activeValue) {
  const container = $(containerSelector);
  if (!container) return;

  container.querySelectorAll(".choice").forEach((button) => {
    const value = button.dataset.value || button.dataset.noteTag;
    button.classList.toggle("active", value === activeValue);
  });
}


/* =========================
   13. 本周页渲染
   ========================= */

function renderWeeklyPlan() {
  const plan = appState.weeklyPlan;

  $("#weeklyTitle").textContent = plan.title;
  $("#weeklyTheme").textContent = plan.theme;
  $("#weeklyPressure").textContent = plan.pressureLevel;
  $("#weeklyStartDate").textContent = plan.startDate;
  $("#weeklyEndDate").textContent = plan.endDate;
  $("#weeklyOutlineInput").value = plan.rawOutline || "";

  renderWeeklyDays();
  renderWeeklyExtraTasks();
}

function renderWeeklyDays() {
  const container = $("#weeklyDayList");
  const days = appState.weeklyPlan.days || [];

  if (days.length === 0) {
    container.innerHTML = `<div class="empty-state"><p>这一周还没有计划。可以先把大纲粘贴进来。</p></div>`;
    return;
  }

  container.innerHTML = days.map((day) => {
    return `
      <div class="day-block">
        <div class="day-title">${escapeHtml(day.title)}</div>
        <div class="day-content">
          ${day.items.map((item) => `
            <p>
              <span class="time-block-label">${escapeHtml(item.timeBlock)}：</span>
              ${escapeHtml(item.text)}
            </p>
          `).join("")}
        </div>
      </div>
    `;
  }).join("");
}

function renderWeeklyExtraTasks() {
  const weeklyTasks = appState.tasks.filter((task) => {
    return task.showWeekly && task.source !== "weekly_plan" && task.status !== "cancelled";
  });

  renderTaskList("#weeklyExtraTaskList", weeklyTasks, {
    emptyText: "暂时没有额外加入本周的任务。",
    compact: true
  });
}

function toggleWeeklyOutline() {
  $("#weeklyOutlineArea").classList.toggle("hidden");
}

function handleSaveWeeklyOutline() {
  appState.weeklyPlan.rawOutline = $("#weeklyOutlineInput").value.trim();
  saveAll();
  showToast("本周大纲已经保存。", "success");
}

function handleSaveWeeklyReview() {
  appState.weeklyReview.text = $("#weeklyReviewInput").value.trim();
  saveAll();
  showToast("周复盘已经保存。", "success");
}

function renderWeeklyReview() {
  const total = appState.tasks.filter((task) => task.status !== "cancelled").length;
  const done = appState.tasks.filter((task) => task.status === "done").length;
  const postponed = appState.tasks.filter((task) => task.status === "postponed").length;
  const bestRoutine = getBestRoutine();

  $("#reviewDoneCount").textContent = done;
  $("#reviewTotalCount").textContent = total;
  $("#reviewPostponedCount").textContent = postponed;
  $("#reviewBestRoutine").textContent = bestRoutine;
  $("#weeklyReviewInput").value = appState.weeklyReview.text || "";
}

function getBestRoutine() {
  if (appState.routines.length === 0) return "暂无";

  const best = [...appState.routines].sort((a, b) => b.bestStreak - a.bestStreak)[0];
  return `${best.title} ${best.bestStreak} DAYS`;
}


/* =========================
   14. 四象限渲染
   ========================= */

function renderMatrix() {
  for (let i = 1; i <= 4; i += 1) {
    const tasks = appState.tasks.filter((task) => {
      return task.quadrant === i && task.status !== "cancelled";
    });

    renderTaskList(`#quadrant${i}List`, sortTasks(tasks), {
      emptyText: getQuadrantEmptyText(i),
      compact: false
    });
  }
}

function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    if (a.status === "done" && b.status !== "done") return 1;
    if (a.status !== "done" && b.status === "done") return -1;

    if (a.showToday && !b.showToday) return -1;
    if (!a.showToday && b.showToday) return 1;

    const deadlineA = a.deadline || "9999-12-31";
    const deadlineB = b.deadline || "9999-12-31";

    return deadlineA.localeCompare(deadlineB);
  });
}

function getQuadrantEmptyText(quadrant) {
  const map = {
    1: "这里暂时没有火烧眉毛的任务。",
    2: "这里可以放长期重要的事情，比如学习、项目、健康。",
    3: "很好，暂时没有太多杂事追着你。",
    4: "这里空着也没关系。"
  };

  return map[quadrant] || "这里暂时没有任务。";
}


/* =========================
   15. 连击页渲染
   ========================= */

function renderRoutines() {
  const total = appState.routines.length;
  const done = appState.routines.filter((routine) => routine.isDoneToday).length;
  const freezeUsed = appState.routines.reduce((sum, routine) => {
    return sum + Number(routine.weeklyFreezeUsed || 0);
  }, 0);
  const freezeLimit = appState.routines.reduce((sum, routine) => {
    return sum + Number(routine.weeklyFreezeLimit || 0);
  }, 0);

  $("#routineDoneCount").textContent = done;
  $("#routineTotalCount").textContent = total;
  $("#routineFreezeUsed").textContent = freezeUsed;
  $("#routineFreezeLimit").textContent = freezeLimit;

  const container = $("#routineCardList");

  if (appState.routines.length === 0) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = appState.routines.map((routine) => {
    return createRoutineCardHtml(routine);
  }).join("");

  bindRoutineEvents();
}

function createRoutineCardHtml(routine) {
  const isDone = routine.isDoneToday;

  return `
    <section class="streak-card ${isDone ? "routine-done" : ""}" data-routine-id="${routine.id}">
      <div class="streak-name">${escapeHtml(routine.title)}</div>

      <div class="streak-data">
        <div class="streak-data-item">
          <span class="streak-label">CURRENT</span>
          <span class="streak-value">${routine.currentStreak} DAYS</span>
        </div>

        <div class="streak-data-item">
          <span class="streak-label">BEST</span>
          <span class="streak-value">${routine.bestStreak} DAYS</span>
        </div>
      </div>

      <div class="streak-actions">
        <button class="flat-button primary routine-done-btn" type="button" ${isDone ? "disabled" : ""}>
          ${isDone ? "今日已完成" : "今天完成了"}
        </button>

        ${
          routine.allowFreeze
            ? `<button class="flat-button routine-freeze-btn" type="button">使用豁免</button>`
            : ""
        }
      </div>
    </section>
  `;
}

function bindRoutineEvents() {
  $all(".streak-card").forEach((card) => {
    const routineId = Number(card.dataset.routineId);

    const doneBtn = card.querySelector(".routine-done-btn");
    if (doneBtn) {
      doneBtn.addEventListener("click", () => {
        completeRoutine(routineId);
      });
    }

    const freezeBtn = card.querySelector(".routine-freeze-btn");
    if (freezeBtn) {
      freezeBtn.addEventListener("click", () => {
        freezeRoutine(routineId);
      });
    }
  });
}

function findRoutine(routineId) {
  return appState.routines.find((routine) => routine.id === routineId);
}

function completeRoutine(routineId) {
  const routine = findRoutine(routineId);
  if (!routine || routine.isDoneToday) return;

  routine.isDoneToday = true;
  routine.currentStreak += 1;
  routine.bestStreak = Math.max(routine.bestStreak, routine.currentStreak);

  saveAll();
  renderAll();
  showToast("今天完成了，已经记录。", "success");
}

function freezeRoutine(routineId) {
  const routine = findRoutine(routineId);
  if (!routine || !routine.allowFreeze) return;

  if (routine.weeklyFreezeUsed >= routine.weeklyFreezeLimit) {
    showToast("这条连击本周已经没有豁免次数。", "warning");
    return;
  }

  const confirmed = window.confirm("今天先放一放，不打断这条连击。确认使用豁免吗？");
  if (!confirmed) return;

  routine.weeklyFreezeUsed += 1;
  routine.isDoneToday = true;

  saveAll();
  renderAll();
  showToast("已经使用豁免。", "success");
}


/* =========================
   16. 随记渲染与操作
   ========================= */

function renderNotes() {
  const container = $("#quickNoteList");
  const notes = appState.notes.filter((note) => !note.isArchived);

  if (notes.length === 0) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = notes.map((note) => createNoteCardHtml(note)).join("");
  bindNoteEvents();
}

function createNoteCardHtml(note) {
  const tagText = NOTE_TAGS[note.tag] || "随记";
  const dateText = formatDateTime(note.createdAt);

  return `
    <article class="note-card" data-note-id="${note.id}">
      <div class="note-head">
        <span class="note-tag ${note.tag}">${tagText}</span>
        <span class="note-date">${dateText}</span>
      </div>

      <p class="note-content">${escapeHtml(note.content)}</p>

      <div class="note-actions">
        <button class="flat-button small note-convert-btn" type="button">转任务</button>
        <button class="flat-button small note-archive-btn" type="button">归档</button>
      </div>
    </article>
  `;
}

function bindNoteEvents() {
  $all(".note-card").forEach((card) => {
    const noteId = getNoteId(card);

    card.querySelector(".note-convert-btn").addEventListener("click", () => {
      convertNoteToTask(noteId);
    });

    card.querySelector(".note-archive-btn").addEventListener("click", () => {
      archiveNote(noteId);
    });
  });
}

function getNoteId(noteElement) {
  const rawId = noteElement.dataset.noteId;
  const numericId = Number(rawId);

  return Number.isNaN(numericId) ? rawId : numericId;
}

function handleSaveQuickNote() {
  const content = $("#quickNoteInput").value.trim();

  if (!content) {
    showToast("可以先写一句很短的话。", "warning");
    return;
  }

  const note = {
    id: createId("note"),
    content,
    tag: appState.selectedNoteTag,
    mood: "",
    isArchived: false,
    convertedTaskId: null,
    createdAt: new Date().toISOString()
  };

  appState.notes.unshift(note);
  $("#quickNoteInput").value = "";

  saveAll();
  renderNotes();
  showToast("已经保存到随记。", "success");
}

function handleSaveDailyNote() {
  const content = $("#dailyNoteInput").value.trim();

  if (!content) {
    showToast("今天一句话可以很短，但不能是空的。", "warning");
    return;
  }

  const note = {
    id: createId("note"),
    content,
    tag: "daily",
    mood: "",
    isArchived: false,
    convertedTaskId: null,
    createdAt: new Date().toISOString()
  };

  appState.notes.unshift(note);
  $("#dailyNoteInput").value = "";

  saveAll();
  renderNotes();
  showToast("今日一句话已经保存。", "success");
}

function convertNoteToTask(noteId) {
  const note = appState.notes.find((item) => item.id === noteId);
  if (!note) return;

  openNewTaskPage({
    description: note.content,
    fromNoteId: note.id
  });

  $("#taskTitle").placeholder = "给这条随记整理成一个任务名";
}

function archiveNote(noteId) {
  const note = appState.notes.find((item) => item.id === noteId);
  if (!note) return;

  note.isArchived = true;

  saveAll();
  renderNotes();
  showToast("已经归档。", "success");
}


/* =========================
   17. 数据导入 / 导出
   ========================= */

function buildExportPayload() {
  return {
    app: "self-recovery-system",
    version: typeof APP_VERSION !== "undefined" ? APP_VERSION : "1.0.0",
    exportedAt: new Date().toISOString(),
    data: {
      tasks: appState.tasks,
      routines: appState.routines,
      notes: appState.notes,
      weeklyPlan: appState.weeklyPlan,
      weeklyReview: appState.weeklyReview
    }
  };
}

function handleExportData() {
  const payload = buildExportPayload();
  const content = JSON.stringify(payload, null, 2);
  const blob = new Blob([content], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const date = getTodayDateString();

  const link = document.createElement("a");
  link.href = url;
  link.download = `self-recovery-backup-${date}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
  showToast("备份已经导出。", "success");
}

function handleImportData(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result || ""));
      const imported = normalizeImportedPayload(parsed);

      if (!imported) {
        showToast("导入失败：文件格式不符合要求。", "warning");
        return;
      }

      const confirmed = window.confirm("导入会覆盖当前浏览器中的数据。确认继续吗？");
      if (!confirmed) return;

      appState.tasks = imported.tasks;
      appState.routines = imported.routines;
      appState.notes = imported.notes;
      appState.weeklyPlan = imported.weeklyPlan;
      appState.weeklyReview = imported.weeklyReview;

      saveAll();
      renderAll();
      showToast("导入完成。", "success");
    } catch (error) {
      console.warn("导入数据失败", error);
      showToast("导入失败：JSON 无法解析。", "warning");
    } finally {
      event.target.value = "";
    }
  };

  reader.readAsText(file, "utf-8");
}

function normalizeImportedPayload(payload) {
  const data = payload && payload.data ? payload.data : payload;
  if (!data || typeof data !== "object") return null;

  const tasks = Array.isArray(data.tasks) ? data.tasks : null;
  const routines = Array.isArray(data.routines) ? data.routines : null;
  const notes = Array.isArray(data.notes) ? data.notes : null;
  const weeklyPlan = data.weeklyPlan && typeof data.weeklyPlan === "object" ? data.weeklyPlan : null;
  const weeklyReview = data.weeklyReview && typeof data.weeklyReview === "object" ? data.weeklyReview : null;

  if (!tasks || !routines || !notes || !weeklyPlan || !weeklyReview) {
    return null;
  }

  return { tasks, routines, notes, weeklyPlan, weeklyReview };
}

function handleResetDemoData() {
  const confirmed = window.confirm("确认清空当前浏览器数据，并恢复公开示例数据吗？");
  if (!confirmed) return;

  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  loadState();
  renderAll();
  showToast("已经恢复示例数据。", "success");
}


/* =========================
   18. Toast
   ========================= */

function showToast(message, type = "success") {
  const oldToast = $(".toast");
  if (oldToast) {
    oldToast.remove();
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 1800);
}


/* =========================
   19. 格式化工具
   ========================= */

function formatSource(source) {
  const map = {
    weekly_plan: "本周计划",
    manual: "手动新增",
    routine: "常规任务",
    note: "随记转入"
  };

  return map[source] || "手动新增";
}

function formatDateTime(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const year = date.getFullYear();
  const month = padZero(date.getMonth() + 1);
  const day = padZero(date.getDate());

  return `${year}/${month}/${day}`;
}

function getTodayDateString() {
  const date = new Date();
  const year = date.getFullYear();
  const month = padZero(date.getMonth() + 1);
  const day = padZero(date.getDate());

  return `${year}-${month}-${day}`;
}

function padZero(value) {
  return String(value).padStart(2, "0");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


/* =========================
   20. 调试辅助，可选
   ========================= */

window.lifeRecoveryDebug = {
  state: appState,
  saveAll,
  renderAll,
  reset() {
    localStorage.removeItem(STORAGE_KEYS.tasks);
    localStorage.removeItem(STORAGE_KEYS.routines);
    localStorage.removeItem(STORAGE_KEYS.notes);
    localStorage.removeItem(STORAGE_KEYS.weeklyPlan);
    localStorage.removeItem(STORAGE_KEYS.weeklyReview);
    window.location.reload();
  }
};