import { Component, OnInit, inject } from '@angular/core';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { AppStoreService } from '../../shared/services/data/app.store.service';
import { DateUtils } from '../../shared/services/util/date-utils.service';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-store-info',
  templateUrl: './store-info.html',
  styleUrls: ['./store-info.scss'],
  standalone: true,
  imports: [GoogleMap, MapMarker, TranslateModule, IonicModule],
})
export class StoreInfo implements OnInit {
  protected appStoreService = inject(AppStoreService);
  protected dateUtils = inject(DateUtils);
  private translateService = inject(TranslateService);

  // 地图配置
  mapOptions: google.maps.MapOptions = {
    center: { lat: 21.3069, lng: -157.8583 }, // 默认坐标（火奴鲁鲁）
    zoom: 15,
  };

  // 地图标记点
  mapMarker: google.maps.MarkerOptions = {
    position: { lat: 21.3069, lng: -157.8583 },
  };

  // 营业时间数据
  businessHours = [
    { day: 1, text: this.translateService.instant('app.weekday.1'), open: '10:00', close: '22:00' },
    { day: 2, text: this.translateService.instant('app.weekday.2'), open: '10:00', close: '22:00' },
    { day: 3, text: this.translateService.instant('app.weekday.3'), open: '10:00', close: '22:00' },
    { day: 4, text: this.translateService.instant('app.weekday.4'), open: '10:00', close: '22:00' },
    { day: 5, text: this.translateService.instant('app.weekday.5'), open: '10:00', close: '23:00' },
    { day: 6, text: this.translateService.instant('app.weekday.6'), open: '10:00', close: '23:00' },
    { day: 0, text: this.translateService.instant('app.weekday.0'), open: '10:00', close: '22:00' },
  ];

  // 当前营业状态
  isOpen = false;

  ngOnInit() {
    // 初始化门店数据
    this.appStoreService.init();
    
    // 设置地图标记点（预埋方法）
    this.setMapMarker();
    
    // 检查营业状态
    this.isOpen = this.isStoreOpen();
  }

  /**
   * 检查门店是否营业
   */
  isStoreOpen(): boolean {
    const currentDay = this.dateUtils.getCurrentWeekDay().week;
    const todayHours = this.businessHours.find(hour => hour.day === currentDay);
    
    if (!todayHours) return false;
    
    return this.dateUtils.isTimeInRange(todayHours.open, todayHours.close);
  }

  /**
   * 获取营业状态文本
   */
  getOpenStatusText(): string {
    return this.isOpen 
      ? this.translateService.instant('storeInfo.open') 
      : this.translateService.instant('storeInfo.closed');
  }

  /**
   * 设置地图标记点（预埋方法）
   */
  setMapMarker() {
    // 从AppStoreService获取门店坐标（当前接口暂未提供坐标数据）
    // 预留方法，后续可根据实际接口返回数据进行调整
  }
}