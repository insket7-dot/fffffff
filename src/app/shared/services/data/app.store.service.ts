import { Injectable, signal, computed, effect } from '@angular/core';
import { AbstractAppService } from '@app/shared/abstracts/abstract.app.service';
import { LocalStorage } from '@rydeen/angular-framework';
import { CacheKey } from '@app/shared/constants/cache.key';
import { AppUrl } from '@app/core/constants/app.url';
import {
    CarouselImage,
    StoreBaseInfoInterface,
    CarouselImageResponseVO,
    ChangeTime,
    StoreTaxGroupVO,
    TrdMasterStoreExtraChangeInfoVo,
    ExceptionTimeVO,
} from '@app/shared/types/store.shared.types';
import { DateUtils } from '@app/shared/services/util/date-utils.service';
import { ExtraChargeTypeEnum } from '@app/shared/constants/tax.enums';
import { StoreCarouselConstants } from '@app/shared/constants/app.constants';

@Injectable({
    providedIn: 'root',
})
export class AppStoreService extends AbstractAppService {
    private carouselImages = signal<CarouselImage[]>([]);
    private storeBusTime = signal<ExceptionTimeVO[]>([]);
    private storeBaseInfo = signal<StoreBaseInfoInterface | null>(null);
    private initialized = false;
    // 税率组Map - 键为税率组编码，值为税率组对象
    private _taxGroup = signal<Map<string, StoreTaxGroupVO>>(new Map());
    // 附加费税率组Map - 键为税率组编码，值为税率组对象
    private _extraChange = signal<Map<string, TrdMasterStoreExtraChangeInfoVo>>(new Map());

    // 轮播图过期检查定时器
    private carouselExpireTimer: any;
    private rawCarouselData = signal<CarouselImageResponseVO | null>(null);
    constructor(private dateUtils: DateUtils) {
        super();

        this.setupPersistence();
        // 过期检查
        this.startCarouselExpireCheck();
    }

    // 轮播图
    readonly carouselImagesValue = computed(() => this.carouselImages());
    // 营业时间
    readonly storeBusTimeValue = computed(() => this.storeBusTime());
    // 门店全量信息
    readonly storeBaseInfoValue = computed(() => this.storeBaseInfo());
    // 附加费税率组 - 已过滤
    readonly extraChangeValue = computed(() => {
        // 过滤订单附加费
        const list = (this.storeBaseInfo()?.extraChange || [])
            .filter((t) => t.extraChargeType === ExtraChargeTypeEnum.ORDER)
            .filter((t) => this.isNowInValidity(t.validityTime ?? []));
        // 当前点餐模式
        const type = this.modelStateService.curWayValue();
        if (type) {
            return list.filter((t) => t.useOrderType?.includes(type));
        }
        return list;
    });
    // 税率组
    readonly taxGroupValue = computed(() => this.storeBaseInfo()?.taxGroup);

    ngOnDestroy() {
        if (this.carouselExpireTimer) {
            clearInterval(this.carouselExpireTimer);
        }
    }

    async init() {
        if (this.initialized) return;

        await this.readPersistence();

        await Promise.allSettled([
            this.getRemoteStoreBusTime(),
            this.getRemoteCarouselImages(),
            this.getRemoteStoreBaseInfo(),
        ]);

        this.initialized = true;
    }

    /**
     * @desc 判定门店税率和菜品税率是否一致
     */
    isTaxGroupSame(groupCode: string) {
        if (!groupCode) return false;

        return this.storeBaseInfoValue()?.taxGroupCode === groupCode;
    }

    /**
     * @desc 根据税率组编码获取税率组
     */
    getGroupByCode(code: string) {
        return this._taxGroup().get(code);
    }

    /**
     * @desc 过滤附加费税率组是否在当前时间范围内
     */
    isNowInValidity(validityTime: ChangeTime[]): boolean {
        // 没有有效期，默认有效
        if (!validityTime || validityTime.length === 0) return true;

        const now = new Date();
        return validityTime.some((item) => {
            const start = new Date(item.startTime);
            const end = new Date(item.endTime);

            return now >= start && now <= end;
        });
    }

    /**
     * @desc 远程门店轮播图列表
     */
    async getRemoteCarouselImages() {
        const res = await this.request<CarouselImageResponseVO[]>(AppUrl.GET_RESOURCE, {
            pageCode: StoreCarouselConstants.PAGE_CODE,
            operationAreaCode: StoreCarouselConstants.OPERATION_AREA_CODE,
            nowDate: this.dateUtils.formatDateTime(new Date()),
        });
        const data = res.data[0] || {};
        if (res.success && data?.pics) {
            this.rawCarouselData.set(data);
            const newImages: CarouselImage[] = data.pics ? JSON.parse(data.pics) : [];
            if (JSON.stringify(newImages) !== JSON.stringify(this.carouselImages())) {
                this.carouselImages.set(newImages);
            }
        } else {
            this.rawCarouselData.set(null);
            this.carouselImages.set([]);
        }
    }

    /**
     * 启动轮播图过期检查定时器
     * 每小时检查一次是否过期
     */
    private startCarouselExpireCheck() {
        // 清除现有定时器
        if (this.carouselExpireTimer) {
            clearInterval(this.carouselExpireTimer);
        }

        // 立即执行一次检查
        this.checkAndClearExpiredCarousel();

        // 设置定时器，每小时检查一次
        this.carouselExpireTimer = setInterval(() => {
            this.checkAndClearExpiredCarousel();
        }, 3600000);
    }

    /**
     * 检查并清除已过期的轮播图
     */
    private checkAndClearExpiredCarousel() {
        LocalStorage.getItem(CacheKey.CAROUSEL_RAW_DATA).then((rawDataStr: any) => {
            if (rawDataStr) {
                try {
                    const rawData: CarouselImageResponseVO = JSON.parse(rawDataStr);
                    if (this.checkCarouselExpired(rawData)) {
                        this.carouselImages.set([]);
                    }
                } catch (error) {
                    console.error('解析轮播图原始数据失败:', error);
                }
            }
        });
    }

    /**
     * 检查轮播图是否过期
     */
    private checkCarouselExpired(carouselData: CarouselImageResponseVO): boolean {
        if (!carouselData.businessEndTime) return false;

        const now = new Date();
        const endTime = new Date(carouselData.businessEndTime);

        if (isNaN(endTime.getTime())) return false;

        return now > endTime;
    }

    /**
     * @desc 远程门店营业时间
     */
    async getRemoteStoreBusTime() {
        const res = await this.request<ExceptionTimeVO[]>(AppUrl.STORE_BUS_TIME);
        const data = res.data;
        if (res.success && JSON.stringify(data) !== JSON.stringify(this.storeBusTime())) {
            this.storeBusTime.set(data);
        } else {
            this.storeBusTime.set([]);
        }
    }

    /**
     * @desc 远程门店基础数据
     */
    async getRemoteStoreBaseInfo() {
        const res = await this.request<StoreBaseInfoInterface>(AppUrl.STORE_BASE_INFO);
        const data = res.data;
        if (res.success && JSON.stringify(data) !== JSON.stringify(this.storeBaseInfo())) {
            this.storeBaseInfo.set(data);
        }
    }

    /**
     * @desc 读取本地缓存
     */
    private async readPersistence() {
        try {
            const [hasStoreBusTime, hasCarousel, hasStoreBaseInfo] = await Promise.all([
                LocalStorage.isExist(CacheKey.STORE_BUS_TIMES),
                LocalStorage.isExist(CacheKey.CAROUSEL_IMAGES),
                LocalStorage.isExist(CacheKey.STORE_BASE_INFO),
            ]);

            if (hasStoreBusTime) {
                const storeBusTime: string | null = await LocalStorage.getItem(
                    CacheKey.STORE_BUS_TIMES,
                );
                if (storeBusTime) {
                    this.storeBusTime.set(JSON.parse(storeBusTime) as ExceptionTimeVO[]);
                }
            }
            if (hasCarousel) {
                const carouselStr: string | null = await LocalStorage.getItem(
                    CacheKey.CAROUSEL_IMAGES,
                );
                if (carouselStr) {
                    this.carouselImages.set(JSON.parse(carouselStr) as CarouselImage[]);
                }
            }
            if (hasStoreBaseInfo) {
                const baseInfoStr: string | null = await LocalStorage.getItem(
                    CacheKey.STORE_BASE_INFO,
                );
                if (baseInfoStr) {
                    this.storeBaseInfo.set(JSON.parse(baseInfoStr) as StoreBaseInfoInterface);
                }
            }
        } catch (error) {
            console.error('从缓存加载失败:', error);
        }
    }

    /**
     * @desc 本地固化
     */
    private setupPersistence() {
        effect(() => {
            const baseInfo = this.storeBaseInfo();
            if (baseInfo) {
                LocalStorage.setItem(CacheKey.STORE_BASE_INFO, JSON.stringify(baseInfo)).catch(
                    (err) => console.error('存储门店基础信息失败:', err),
                );
                // 设置税率组Map
                if (baseInfo.taxGroup) {
                    this._taxGroup.set(
                        new Map([[baseInfo.taxGroup.groupCode ?? '', baseInfo.taxGroup]]),
                    );
                }
                // 设置附加费税率组Map
                if (baseInfo.extraChange && baseInfo.extraChange.length) {
                    this._extraChange.set(
                        new Map(baseInfo.extraChange.map((t) => [t.id?.toString() ?? '', t])),
                    );
                }
            }
        });

        effect(() => {
            const storeBusTime = this.storeBusTime();
            if (storeBusTime) {
                LocalStorage.setItem(CacheKey.STORE_BUS_TIMES, JSON.stringify(storeBusTime)).catch(
                    (err) => console.error('存储店铺信息失败:', err),
                );
            }
        });

        effect(() => {
            const images = this.carouselImages();
            if (images) {
                LocalStorage.setItem(CacheKey.CAROUSEL_IMAGES, JSON.stringify(images)).catch(
                    (err) => console.error('存储轮播图失败:', err),
                );
            }
        });

        effect(() => {
            const rawCarouselData = this.rawCarouselData();
            if (rawCarouselData) {
                LocalStorage.setItem(
                    CacheKey.CAROUSEL_RAW_DATA,
                    JSON.stringify(rawCarouselData),
                ).catch((err) => console.error('存储轮播图原始数据失败:', err));
            }
        });
    }
}
