import { Injectable, signal } from '@angular/core';
import { AppUrlService } from '@app/shared/services/util/app.url.service';
import { StoreInfo } from '../types/home.types';

@Injectable({ providedIn: 'root' })
export class HomeService {
    constructor(private appUrlService: AppUrlService) {}

    // 店铺信息信号
    private readonly _storeInfo = signal<StoreInfo>({
        name: 'StoreName',
        address: '1450 Ala Moana Blvd, Honolulu...',
        tagline: 'Authentic Chinese Flavors, Crafted with Heart',
        imageUrl: ''
    });

    // 暴露只读店铺信息
    readonly storeInfo = this._storeInfo.asReadonly();

    init() {
        console.log('HomeService init');
        console.log(this.appUrlService.getPageUrlValue('PAGE_HOME'));
        // 这里可以添加获取店铺信息的API调用
        this.loadStoreInfo();
    }

    /**
     * 加载店铺信息
     */
    private loadStoreInfo() {
        // 模拟API调用，实际项目中可以替换为真实的HTTP请求
        setTimeout(() => {
            // 这里可以从API获取真实的店铺信息
            // this._storeInfo.set(apiResponse);
        }, 1000);
    }

    /**
     * 设置店铺信息
     */
    setStoreInfo(storeInfo: StoreInfo) {
        this._storeInfo.set(storeInfo);
    }
}
