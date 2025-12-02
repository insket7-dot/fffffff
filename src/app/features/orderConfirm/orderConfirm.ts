import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractAppPage } from '@app/shared/abstracts/abstract.app.page';
import { TranslateModule } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { PriceI18nPipe, I18nFieldPipe } from '@app/shared/pipes/i18n-field.pipe';
import { AppUrlService } from '@app/shared/services/util/app.url.service';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomeService } from '@/app/features/home/service/home.service';
import { wayList as diningWayList } from '@/app/shared/constants/menu.constants';
import { ModelStateService } from '@app/shared/services/data/model-state.service';

@Component({
    selector: 'app-orderConfirm',
    templateUrl: './orderConfirm.html',
    styleUrls: ['./orderConfirm.scss'],
    imports: [TranslateModule, CommonModule, IonicModule, FormsModule],
})
export class OrderConfirm extends AbstractAppPage {
    wayList = computed(() => diningWayList);

    private curWayValue = computed(() => this.modelStateService.curWayValue());
    getDiningPeople = computed(() => this.homeService.getDiningPeople());

    selectedWayValue = signal<string>('');

    constructor(
        private location: Location,
        private readonly appUrlService: AppUrlService,
        private homeService: HomeService,
        private modelStateService: ModelStateService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.selectedWayValue.set(this.curWayValue());
    }

    onDiningTypeChange(event:any) {
        this.modelStateService.setCurWay(event.detail.value);
    }
}
