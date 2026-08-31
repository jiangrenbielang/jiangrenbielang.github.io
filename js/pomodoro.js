// 番茄钟核心逻辑
(function() {
  const WORK_TIME = 25 * 60;
  const SHORT_BREAK = 5 * 60;
  const LONG_BREAK = 15 * 60;
  const SESSIONS_BEFORE_LONG_BREAK = 4;

  let state = {
    mode: 'work',
    timeLeft: WORK_TIME,
    totalTime: WORK_TIME,
    isRunning: false,
    completedSessions: 0,
    timerId: null,
  };

  const listeners = [];

  function getState() {
    return { ...state };
  }

  function setState(partial) {
    Object.assign(state, partial);
    notify();
  }

  function notify() {
    listeners.forEach(fn => fn(getState()));
  }

  function subscribe(fn) {
    listeners.push(fn);
    fn(getState());
  }

  function switchMode() {
    if (state.mode === 'work') {
      state.completedSessions++;
      if (state.completedSessions % SESSIONS_BEFORE_LONG_BREAK === 0) {
        state.mode = 'longBreak';
        state.totalTime = LONG_BREAK;
      } else {
        state.mode = 'shortBreak';
        state.totalTime = SHORT_BREAK;
      }
    } else {
      state.mode = 'work';
      state.totalTime = WORK_TIME;
    }
    state.timeLeft = state.totalTime;
    setState({ mode: state.mode, totalTime: state.totalTime, timeLeft: state.timeLeft });
  }

  function tick() {
    if (state.timeLeft > 0) {
      state.timeLeft--;
      setState({ timeLeft: state.timeLeft });
      if (state.timeLeft === 0) {
        clearInterval(state.timerId);
        state.isRunning = false;
        setState({ isRunning: false });
        // 可改为声音提醒或浏览器通知
        alert('时间到！');
        switchMode();
      }
    }
  }

  function start() {
    if (state.isRunning) return;
    state.isRunning = true;
    state.timerId = setInterval(tick, 1000);
    setState({ isRunning: true });
  }

  function pause() {
    clearInterval(state.timerId);
    state.isRunning = false;
    setState({ isRunning: false });
  }

  function reset() {
    clearInterval(state.timerId);
    state = {
      mode: 'work',
      timeLeft: WORK_TIME,
      totalTime: WORK_TIME,
      isRunning: false,
      completedSessions: 0,
      timerId: null,
    };
    setState({ ...state });
  }

  function toggle() {
    if (state.isRunning) {
      pause();
    } else {
      start();
    }
  }

  window.PomodoroApp = {
    subscribe,
    start,
    pause,
    reset,
    toggle,
    getState,
    switchMode,
  };
})();

// 番茄钟页面初始化函数（供页面调用）
window.initPomodoroPage = function() {
  const container = document.getElementById('pomodoro-page');
  if (!container || container.dataset.initialized) return;
  container.dataset.initialized = 'true';

  const timeDisplay = document.getElementById('pomodoro-time');
  const modeDisplay = document.getElementById('pomodoro-mode');
  const startBtn = document.getElementById('pomodoro-start');
  const resetBtn = document.getElementById('pomodoro-reset');
  const sessionsDisplay = document.getElementById('pomodoro-sessions');
  const circle = document.getElementById('pomodoro-circle');
  const CIRCUMFERENCE = 2 * Math.PI * 70;

  function render(state) {
    const mins = Math.floor(state.timeLeft / 60);
    const secs = state.timeLeft % 60;
    timeDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    const progress = state.timeLeft / state.totalTime;
    circle.style.strokeDashoffset = CIRCUMFERENCE * (1 - progress);

    const modeNames = { work: '专注时间', shortBreak: '短休息', longBreak: '长休息' };
    modeDisplay.textContent = modeNames[state.mode];
    sessionsDisplay.textContent = `今日完成：${state.completedSessions} 个番茄`;
    startBtn.textContent = state.isRunning ? '暂停' : '开始';
  }

  PomodoroApp.subscribe(render);

  startBtn.addEventListener('click', () => {
    PomodoroApp.toggle();
  });
  resetBtn.addEventListener('click', () => {
    PomodoroApp.reset();
  });
};