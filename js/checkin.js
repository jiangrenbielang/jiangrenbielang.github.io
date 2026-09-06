// 每日打卡 —— 数据层（与页面展示逻辑分离，仅负责 localStorage 读写）
(function() {
  // 专用且唯一的存储键名：以功能命名，避免与站点内其他脚本冲突。
  // 键名保持稳定，不随数据结构版本变化；版本号存放在数据结构内部（见 DATA_VERSION）。
  const STORAGE_KEY = 'utopia-checkin';
  const DATA_VERSION = 1;

  // 三个打卡任务：名称固定、顺序固定。
  const TASKS = [
    { id: 'daily-words', name: '完成每日单词' },
    { id: 'daily-math', name: '完成每日数学题' },
    { id: 'daily-summary', name: '完成每日总结' },
  ];

  // 获取用户本地日期字符串 YYYY-MM-DD（每日打卡判断依据，非 UTC）。
  function getLocalDateString() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  // 空数据结构：只创建空壳，不自动生成任何当日打卡记录。
  function emptyData() {
    return { version: DATA_VERSION, records: [] };
  }

  // 读取存储：异常处理，缺失或解析失败时回退为空数据结构，保证页面功能可用。
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return emptyData();
      const data = JSON.parse(raw);
      if (!data || typeof data !== 'object') return emptyData();
      // 兼容旧版本 / 异常结构：只要 records 是数组即可继续使用。
      const records = Array.isArray(data.records) ? data.records : [];
      return { version: DATA_VERSION, records };
    } catch (e) {
      return emptyData();
    }
  }

  // 写入存储：捕获异常，返回是否成功。
  function save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  }

  // 唯一性判断：同一任务 + 同一日期只允许一条记录。
  function hasRecord(records, taskId, date) {
    return records.some(r => r && r.taskId === taskId && r.date === date);
  }

  // 打卡：先读取当日已有记录做重复校验，通过后才新增记录。
  function checkIn(taskId) {
    const data = load();
    const date = getLocalDateString();
    if (hasRecord(data.records, taskId, date)) {
      return { success: false, reason: 'duplicate', date };
    }
    data.records.push({ taskId, date, timestamp: Date.now() });
    if (!save(data)) {
      return { success: false, reason: 'save-failed', date };
    }
    return { success: true, date };
  }

  function getTaskCount(records, taskId) {
    return records.filter(r => r && r.taskId === taskId).length;
  }

  // 返回三个任务的当日状态与历史累计次数。
  function getStatus() {
    const data = load();
    const date = getLocalDateString();
    return TASKS.map(t => ({
      id: t.id,
      name: t.name,
      checked: hasRecord(data.records, t.id, date),
      count: getTaskCount(data.records, t.id),
    }));
  }

  // 汇总三个任务的历史记录总数。
  function getTotal() {
    return load().records.length;
  }

  window.CheckinStore = {
    TASKS,
    DATA_VERSION,
    getLocalDateString,
    load,
    checkIn,
    getStatus,
    getTotal,
  };
})();

// 每日打卡 —— 展示层（仅负责渲染与交互，数据读写交给 CheckinStore）。
window.initCheckinPage = function() {
  const container = document.getElementById('checkin-page');
  const list = document.getElementById('checkin-list');
  if (!container || !list || container.dataset.initialized) return;
  container.dataset.initialized = 'true';

  function render() {
    const status = CheckinStore.getStatus();
    const total = CheckinStore.getTotal();
    const doneCount = status.filter(item => item.checked).length;

    const cards = status.map(item => `
      <div class="checkin-card${item.checked ? ' is-done' : ''}">
        <div class="checkin-name">${item.name}</div>
        <div class="checkin-status">${item.checked ? '今日已打卡' : '今日未打卡'}</div>
        <div class="checkin-count">累计 ${item.count} 次</div>
        <button class="checkin-btn" data-task-id="${item.id}"${item.checked ? ' disabled' : ''}>${item.checked ? '今日已完成' : '打卡'}</button>
      </div>
    `).join('');

    list.innerHTML = `
      <div class="checkin-cards">${cards}</div>
      <div class="checkin-total">今日已完成 ${doneCount} / ${status.length} · 累计打卡 ${total} 次</div>
    `;
  }

  // 打卡按钮：事件委托，点击后由数据层做重复校验。
  list.addEventListener('click', (e) => {
    const btn = e.target.closest('.checkin-btn[data-task-id]');
    if (!btn || btn.disabled) return;
    const taskId = btn.dataset.taskId;
    const result = CheckinStore.checkIn(taskId);
    if (result.success) {
      render();
    } else if (result.reason === 'duplicate') {
      alert('今日已完成打卡');
      render();
    } else {
      alert('打卡失败，请重试');
    }
  });

  render();

  // 跨天处理：页面长时间停留时，本地日期变化后重新判断当日状态，历史记录保留。
  let lastDate = CheckinStore.getLocalDateString();
  setInterval(() => {
    if (!list.isConnected) return; // 页面已被 pjax 替换，跳过
    const now = CheckinStore.getLocalDateString();
    if (now !== lastDate) {
      lastDate = now;
      render();
    }
  }, 60 * 1000);
};
