import { Injectable, signal } from '@angular/core';
import { AbstractAppService } from '@app/shared/abstracts/abstract.app.service';
import { AppUrlService } from '@app/shared/services/util/app.url.service';
import { StoreInfo } from '../types/home.types';
import { DateUtils } from '@app/shared/util/date-utils.service';




@Injectable({ providedIn: 'root' })
export class HomeService extends AbstractAppService {
   diningPeople = signal<number>(0);

    private readonly _storeInfo = signal<StoreInfo>({
        name: 'StoreName',
        address: '1450 Ala Moana Blvd, Honolulu...',
        tagline: 'Authentic Chinese Flavors, Crafted with Heart',
        imageUrl: ''
    });

    // 暴露只读店铺信息
    readonly storeInfo = this._storeInfo.asReadonly();
    constructor(private dateUtils: DateUtils,) {
        super()
    }

    init() {
        this.getCarouselImages();
        this.loadStoreInfo();
    }

    async getCarouselImages() {

    }

    setDiningPeople(num: number) {
        this.diningPeople.set(num)
    }

    getDiningPeople(): number {
        return this.diningPeople();
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
