import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// 动态设置根字体大小 - 基于 375px 设计稿
function setRootFontSize() {
  const designWidth = 375; // 设计稿宽度
  const rootValue = 37.5; // 根字体大小基准
  
  // 获取视口宽度
  const clientWidth = document.documentElement.clientWidth || window.innerWidth;
  
  // 计算字体大小
  let fontSize = (clientWidth / designWidth) * rootValue;
  
  // 限制最小和最大字体大小
  fontSize = Math.max(fontSize, 32); // 最小 32px (对应 320px)
  fontSize = Math.min(fontSize, 50); // 最大 50px (对应 500px)
  
  // 设置根字体大小
  document.documentElement.style.fontSize = fontSize + 'px';
}

// 初始设置
setRootFontSize();

// 监听窗口大小变化
window.addEventListener('resize', setRootFontSize);
window.addEventListener('orientationchange', setRootFontSize);

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
