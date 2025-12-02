import { Injectable, signal, computed, inject } from '@angular/core';
import { MenuType, OrderMode } from '@app/shared/constants/menu.constants';
import { LocalStorage } from '@rydeen/angular-framework';
import { CacheKey } from '@app/shared/constants/cache.key';
import { Router } from '@angular/router';
import { AppUrlService } from '@app/shared/services/util/app.url.service';
import { DeviceIdLoadStatus } from '@app/shared/constants/app.enums';

@Injectable({ providedIn: 'root' })
export class ModelStateService {
    private readonly router = inject(Router);
    private readonly appUrlService = inject(AppUrlService);
    private readonly _curModel = signal<string>(MenuType.NORMAL);
    private readonly _curWay = signal<string>(OrderMode.DINE_IN);
    private readonly _deviceId = signal<string>('');
    private readonly _storeCode = signal<string>('');
    private initialized = false;
    // 静默加载标识
    private readonly _silentLoad = signal<boolean>(false);

    readonly curModelValue = computed(() => this._curModel());
    readonly curWayValue = computed(() => this._curWay());
    readonly deviceIdValue = computed(() => this._deviceId());
    readonly storeCodeValue = computed(() => this._storeCode());

    // 静默加载状态
    readonly silentLoadValue = computed(() => this._silentLoad());

    // 普通模式
    readonly isNormal = computed(() => this.curModelValue() === MenuType.NORMAL);
    // 儿童、无障碍
    readonly isAccessibility = computed(() => this.curModelValue() === MenuType.ACCESSIBILITY);

    // 堂食
    readonly isDineIn = computed(() => this.curWayValue() === OrderMode.DINE_IN);
    // 外卖
    readonly isTakeOut = computed(() => this.curWayValue() === OrderMode.TAKE_OUT);

    /**
     * @desc 设置静默加载状态
     * @param silentLoad 是否静默加载
     */
    setSilentLoad(silentLoad: boolean) {
        this._silentLoad.set(silentLoad);
    }

    /**
     * 确保设备ID已加载
     */
    async ensureDeviceIdLoaded(): Promise<DeviceIdLoadStatus> {
        const loginPath = this.appUrlService.getPageUrlValue('PAGE_LOGIN');
        const isSkipPages = [loginPath].some(
            (path) => this.router.url.startsWith(path) || this.router.url === path,
        );

        if (isSkipPages) {
            return DeviceIdLoadStatus.SKIPPED;
        }

        if (this.initialized) {
            return DeviceIdLoadStatus.LOADED;
        }

        try {
            await this.loadDeviceId();
            return DeviceIdLoadStatus.LOADED;
        } catch (error) {
            return DeviceIdLoadStatus.FAILED;
        }
    }

    /**
     * @desc 加载设备ID
     */
    private async loadDeviceId(): Promise<void> {
        try {
            const id: string | null = await LocalStorage.getItem(CacheKey.DEVICE_ID);
            console.log('加载设备ID:', id);
            if (id) {
                this._deviceId.set(id);
            }
            this.initialized = true;
        } catch (error) {
            console.error('读取设备ID失败:', error);
            this.initialized = false;
            throw error;
        }
    }


    setCurModel(model: string) {
        this._curModel.set(model);
    }
    setCurWay(way: string) {
        this._curWay.set(way);
    }

    setDeviceId(deviceId: string) {
        this._deviceId.set(deviceId);
        LocalStorage.setItem(CacheKey.DEVICE_ID, deviceId).catch((err) => {
            console.error('保存设备ID失败:', err);
        });
    }

    setStoreCode(storeCode: string) {
        this._storeCode.set(storeCode);
    }

    /**
     * @desc 清空选择状态
     */
    clearUserSelectState() {
        this.setCurModel(MenuType.NORMAL);
        this.setCurWay('');
    }
}
