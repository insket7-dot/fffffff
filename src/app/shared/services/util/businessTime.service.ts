import { computed, inject, Injectable } from '@angular/core';
import { AppStoreService } from '../data/app.store.service';
import { DateUtils } from '@app/shared/services/util/date-utils.service';

@Injectable({
    providedIn: 'root',
})
export class BusinessTimeService {
    private appStoreService = inject(AppStoreService);
    private dateUtilsService = inject(DateUtils);

    busTimeValue = computed(() => this.appStoreService.storeBusTimeValue());

    /**
     * 检查当前时间是否在门店营业时间内
     */
    async isStoreOpen(): Promise<boolean> {
        try {
            if (this.busTimeValue().length <= 0) {
                console.warn('未找到营业时间缓存数据');
                return false;
            }

            const currentTime = this.dateUtilsService.getCurrentWeekDay();
            const item = this.busTimeValue().find((t) => t.weeks === currentTime.week);
            if (!item) {
                console.warn(`未找到${currentTime.text}的营业时间数据`);
                return false;
            }

            return this.dateUtilsService.isTimeInRange(item.beginDate, item.endDate);
        } catch (error) {
            console.error('营业时间检查失败:', error);
            return false;
        }
    }
}
