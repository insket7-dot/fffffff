import { Component, computed, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { LanguageSelectorComponent } from '@app/shared/components/language-selector/language-selector';
import { ModelStateService } from '@app/shared/services/data/model-state.service';
import { OrderMode } from '@app/shared/constants/menu.constants';
import { HomeService } from '@app/features/home/service/home.service';
import { chevronForwardOutline,searchOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { AbstractAppPage } from '@/app/shared/abstracts/abstract.app.page';
import { AppUrlService } from '@app/shared/services/util/app.url.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-menu-header',
    templateUrl: './menu-header.html',
    styleUrls: ['./menu-header.scss'],
    standalone: true,
    imports: [TranslateModule, IonicModule, LanguageSelectorComponent, FormsModule],
})
export class MenuHeaderComponent extends AbstractAppPage {
    // 活动展开状态
    isExpanded = signal(false);

    OrderMode = OrderMode;

    private curWayValue = computed(() => this.modelStateService.curWayValue());
    selectedWayValue = signal<string>('');

    constructor(
        private modelStateService: ModelStateService,
        private homeService: HomeService,
        private AppUrlService: AppUrlService,
    ) {
        super();
        addIcons({ chevronForwardOutline,searchOutline });
        this.selectedWayValue.set(this.curWayValue());

    }

    curWay = computed(() => this.modelStateService.curWayValue());
    storeInfo = computed(() => this.homeService.storeInfo());

    onSegmentChange(event: any) {
        this.modelStateService.setCurWay(event.detail.value);
    }

    navigateToStoreDetail() {
        this.router.navigate([this.AppUrlService.getPageUrlValue('PAGE_STORE_DETAIL')]);
    }
    /**
     * 切换活动展开状态
     */
    toggleActivity() {
        this.isExpanded.update((prev) => !prev);
    }

    /**
     * 关闭活动展开
     */
    closeActivity() {
        this.isExpanded.set(false);
    }
}
