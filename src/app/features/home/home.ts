import { Component, OnInit, computed } from '@angular/core';
import { AbstractAppPage } from '@app/shared/abstracts/abstract.app.page';
import { HomeService } from './service/home.service';
import { IonContent, IonInput, IonButton } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { LanguageSelectorComponent } from '@app/shared/components/language-selector/language-selector';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-home',
    imports: [IonContent, FormsModule, LanguageSelectorComponent, IonInput, IonButton, TranslateModule],
    templateUrl: './home.html',
    styleUrl: './home.scss',
})
export class Home extends AbstractAppPage implements OnInit {
    // 人数选择相关
    selectedPeople: number | null = null;
    peopleOptions = [1, 2, 3, 4, 5, 6, 7, 8];
    customPeopleValue: string = '';

    // 店铺信息
    storeInfo = computed(() => this.homeService.storeInfo());

    constructor(public homeService: HomeService) {
        super();
    }

    ngOnInit() {
        this.homeService.init();
    }

    // 获取当前时间
    getCurrentTime(): string {
        return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }

    // 选择人数
    selectPeople(num: number) {
        this.selectedPeople = num;
        this.customPeopleValue = ''; // 清空自定义输入
        console.log(`选择了 ${num} 人用餐`);
    }

    // 自定义人数
    selectCustomPeople() {
        const num = parseInt(this.customPeopleValue);
        if (num > 0 && num <= 20) {
            this.selectedPeople = num;
            console.log(`自定义选择了 ${num} 人用餐`);
        }
    }

    // 开始点餐
    startOrder() {
        if (this.selectedPeople) {
            console.log(`开始为 ${this.selectedPeople} 人点餐`);
            // 这里可以导航到菜单页面或其他逻辑
        }
    }
}
