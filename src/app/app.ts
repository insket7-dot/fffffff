import { Component, signal, inject, OnInit, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EventManager } from '@rydeen/angular-framework';
import { AppEvent } from '@app/core/constants/app.event';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('yaki-web-app');
  private readonly eventManager = inject(EventManager);
  private readonly loadingController = inject(LoadingController);
  
  // 使用signal控制loading状态
  protected readonly isLoading = signal(false);
  private loadingElement: HTMLIonLoadingElement | null = null;
  
  constructor() {
    // 使用effect监听isLoading变化
    effect(() => {
      const loading = this.isLoading();
      if (loading) {
        this.showLoading();
      } else {
        this.hideLoading();
      }
    });
  }
  
  ngOnInit() {
    // 订阅全局loading事件
    this.eventManager.subscribe(AppEvent.SHOW_GLOBAL_LOADING, (isShow: boolean) => {
      this.isLoading.set(isShow);
    });
  }
  
  /**
   * 显示Ionic Loading
   */
  private async showLoading() {
    // 如果loading已经显示，直接返回
    if (this.loadingElement) {
      return;
    }
    
    // 创建并显示loading
    this.loadingElement = await this.loadingController.create({
      message: '加载中...',
      spinner: 'circles',
      translucent: true,
      backdropDismiss: false
    });
    
    await this.loadingElement.present();
  }
  
  /**
   * 隐藏Ionic Loading
   */
  private async hideLoading() {
    // 如果loading不存在，直接返回
    if (!this.loadingElement) {
      return;
    }
    
    // 关闭loading
    await this.loadingElement.dismiss();
    this.loadingElement = null;
  }
}
