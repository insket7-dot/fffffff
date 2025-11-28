import { Component, computed, OnInit, signal } from '@angular/core';
import { AbstractAppPage } from '@app/shared/abstracts/abstract.app.page';
import { HomeService } from './service/home.service';
import { IonContent, IonAvatar, IonInput, IonNote } from '@ionic/angular/standalone';
import { CarouselComponent } from '@/app/shared/components/carousel/carousel.component';
import { CarouselImage } from '@app/shared/types/common.types';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

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

    constructor(private homeService: HomeService) {
        super();
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
        }
    }
}
