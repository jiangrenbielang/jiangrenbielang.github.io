---
title: 番茄钟
date: 2026-09-01 12:00:00
layout: page
---

<div id="pomodoro-page">
  <div class="pomodoro-page-card">
    <h2>专注工作，高效休息</h2>
    <div class="pomodoro-page-timer">
      <div class="pomodoro-progress">
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r="70" fill="none" stroke="#333" stroke-width="8"/>
          <circle id="pomodoro-circle" cx="80" cy="80" r="70" fill="none" stroke="orange" stroke-width="8"
                  stroke-linecap="round" stroke-dasharray="439.82" stroke-dashoffset="0"
                  transform="rotate(-90 80 80)"/>
        </svg>
        <div class="pomodoro-time" id="pomodoro-time">25:00</div>
      </div>
      <div class="pomodoro-mode" id="pomodoro-mode">专注时间</div>
    </div>
    <div class="pomodoro-buttons">
      <button id="pomodoro-start" class="pomodoro-btn">开始</button>
      <button id="pomodoro-reset" class="pomodoro-btn">重置</button>
    </div>
    <div class="pomodoro-sessions" id="pomodoro-sessions">今日完成：0 个番茄</div>
  </div>
</div>

<div id="checkin-page">
  <h3 class="checkin-title">每日打卡</h3>
  <div id="checkin-list"></div>
</div>

<style>
  #pomodoro-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 60vh;
    padding: 40px 20px;
  }
  .pomodoro-page-card {
    background: rgba(37, 35, 40, 0.9);
    border-radius: 16px;
    padding: 40px;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    max-width: 400px;
    width: 100%;
  }
  .pomodoro-page-card h2 {
    color: #ddd;
    margin-bottom: 30px;
    font-size: 24px;
  }
  .pomodoro-progress {
    position: relative;
    width: 160px;
    height: 160px;
    margin: 0 auto 20px;
  }
  .pomodoro-time {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 40px;
    font-weight: bold;
    color: orange;
    letter-spacing: 2px;
  }
  .pomodoro-mode {
    color: #aaa;
    font-size: 18px;
    margin-bottom: 20px;
  }
  .pomodoro-buttons {
    display: flex;
    gap: 15px;
    justify-content: center;
    margin-bottom: 15px;
  }
  .pomodoro-btn {
    padding: 10px 30px;
    border: none;
    border-radius: 25px;
    background: #555;
    color: #fff;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.3s;
  }
  .pomodoro-btn:hover {
    background: orange;
    color: #252328;
  }
  .pomodoro-sessions {
    color: #777;
    font-size: 14px;
  }

  /* —— 每日打卡区域 —— */
  #checkin-page {
    max-width: 640px;
    margin: 0 auto 40px;
    padding: 0 20px;
  }
  .checkin-title {
    color: #ddd;
    text-align: center;
    font-size: 20px;
    margin: 20px 0 16px;
  }
  .checkin-cards {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
  }
  .checkin-card {
    background: rgba(37, 35, 40, 0.9);
    border-radius: 16px;
    padding: 24px 18px;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    flex: 1 1 150px;
    min-width: 150px;
  }
  .checkin-name {
    color: #ddd;
    font-size: 16px;
    margin-bottom: 12px;
  }
  .checkin-status {
    color: #aaa;
    font-size: 13px;
    margin-bottom: 6px;
  }
  .checkin-card.is-done .checkin-status {
    color: #7bc47f;
  }
  .checkin-count {
    color: #777;
    font-size: 13px;
    margin-bottom: 14px;
  }
  .checkin-btn {
    padding: 8px 26px;
    border: none;
    border-radius: 20px;
    background: orange;
    color: #252328;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s;
  }
  .checkin-btn:hover:not(:disabled) {
    background: #ffb84d;
  }
  .checkin-btn:disabled {
    background: #555;
    color: #999;
    cursor: not-allowed;
  }
  .checkin-total {
    text-align: center;
    color: #777;
    font-size: 14px;
    margin-top: 18px;
  }
</style>