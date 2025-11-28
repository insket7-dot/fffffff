import { Injectable, signal } from '@angular/core';
import { AppUrlService } from '@app/shared/services/app.url.service';
import { AbstractAppService } from '@app/shared/abstracts/abstract.app.service';
import { CarouselImageResponseVO,StoreCarouselConstants} from '@app/shared/types/common.types';
import { AppUrl } from '@app/core/constants/app.url';
import { DateUtils } from '@app/shared/util/date-utils.service';




@Injectable({ providedIn: 'root' })
export class HomeService extends AbstractAppService {
   diningPeople = signal<number>(0);
    constructor(private appUrlService: AppUrlService,private dateUtils: DateUtils,) {
        super()
    }

    init() {
        this.getCarouselImages();
    }

    async getCarouselImages() {
        const res = await this.request<CarouselImageResponseVO[]>(AppUrl.GET_RESOURCE, {
            pageCode: StoreCarouselConstants.PAGE_CODE,
            operationAreaCode: StoreCarouselConstants.OPERATION_AREA_CODE,
            nowDate: this.dateUtils.formatDateTime(new Date()),
        });
        const data = res.data[0] || {};
    }

    setDiningPeople(num: number) {
        this.diningPeople.set(num)
    }

    getDiningPeople(): number {
        return this.diningPeople();
    }
}
