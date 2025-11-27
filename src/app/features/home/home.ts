import { Component, OnInit } from '@angular/core';
import { AbstractAppPage } from '@app/shared/abstracts/abstract.app.page';
import { HomeService } from './service/home.service';
import { IonContent } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-home',
    imports: [IonContent, FormsModule],
    templateUrl: './home.html',
    styleUrl: './home.scss',
})
export class Home extends AbstractAppPage implements OnInit {
    // 人数选择相关
    selectedPeople: number | null = null;
    peopleOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    customPeopleValue: string = '';

    constructor(private homeService: HomeService) {
        super();
    }

    ngOnInit() {
        this.homeService.init();
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

    // 获取当前时间
    getCurrentTime(): string {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    // 获取电池电量（模拟）
    getBatteryLevel(): string {
        return '1'; // 模拟电池图标
    }
}
