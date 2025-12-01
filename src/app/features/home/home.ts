import { AppUrlService } from '@app/shared/services/util/app.url.service';
import { Component, computed, OnInit, signal } from '@angular/core';
import { AbstractAppPage } from '@app/shared/abstracts/abstract.app.page';
import { HomeService } from './service/home.service';
import { IonContent, IonAvatar, IonInput, IonNote, IonIcon } from '@ionic/angular/standalone';
import { CarouselComponent } from '@/app/shared/components/carousel/carousel.component';
import { CarouselImage } from '@app/shared/types/common.types';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { chevronForwardOutline } from 'ionicons/icons';
import { LanguageSelectorComponent } from '@app/shared/components/language-selector/language-selector';


@Component({
    selector: 'app-home',
    imports: [
        IonContent,
        CarouselComponent,
        IonAvatar,
        IonInput,
        ReactiveFormsModule,
        IonNote,
        TranslateModule,
        IonIcon,
        LanguageSelectorComponent
    ],
    templateUrl: './home.html',
    styleUrl: './home.scss',
})
export class Home extends AbstractAppPage implements OnInit {
    images: CarouselImage[] = [
        {
            image: 'https://pic.rmb.bdstatic.com/bjh/news/3fe6db1a8d291be39192f9a06c74ce99.png',
            alt: 'carousel image',
            index: 0,
        },
        {
            image: 'https://inews.gtimg.com/om_bt/OPYIh7wcoVd62WEZOJVCO1zRr46Dp6-JROXOEzv0vpk3sAA/641',
            alt: 'carousel image',
            index: 1,
        },
    ];

    dinerCount = new FormControl('', [Validators.max(99), Validators.min(1)]);

    get diningList(): number[] {
        return Array.from({ length: 8 }, (_, i) => i + 1);
    }

    getDiningPeople = computed(() => this.homeService.getDiningPeople());
    storeInfo = computed(() => this.homeService.storeInfo())

    constructor(
        private homeService: HomeService,
        private AppUrlService: AppUrlService,
    ) {
        super();
        addIcons({ chevronForwardOutline });
    }

    ngOnInit() {
        this.homeService.init();
    }

    selectPeople(num: number) {
        this.homeService.setDiningPeople(num);
    }

    customBlur() {
        if (this.dinerCount.valid) {
            this.homeService.setDiningPeople(Number(this.dinerCount.value) || 0);
        }
    }

    startOrder() {
        if (this.getDiningPeople() > 0) {
            this.router.navigate([this.AppUrlService.getPageUrlValue('PAGE_MENU')]);
        } else {
             this.error(this.translate.instant('app.home.noNumber')).catch((error) =>
                console.error(error),
            );
            return;
        }
    }

    // 获取当前时间
    getCurrentTime(): string {
        return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }

    navigateToStoreDetail() {
        this.router.navigate([this.AppUrlService.getPageUrlValue('PAGE_STORE_DETAIL')]);
    }
}
