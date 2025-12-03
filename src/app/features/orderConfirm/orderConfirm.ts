import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractAppPage } from '@app/shared/abstracts/abstract.app.page';
import { TranslateModule } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { PriceI18nPipe, I18nFieldPipe } from '@app/shared/pipes/i18n-field.pipe';
import { AppUrlService } from '@app/shared/services/util/app.url.service';
import { IonicModule, ToastController, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomeService } from '@/app/features/home/service/home.service';
import { wayList as diningWayList } from '@/app/shared/constants/menu.constants';
import { ModelStateService } from '@app/shared/services/data/model-state.service';
import { chevronBackOutline, location, chevronForwardOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { OrderMode } from '@app/shared/constants/menu.constants';
import { TimeSelectComponent } from './components/time-select/time-select.component';

@Component({
    selector: 'app-orderConfirm',
    templateUrl: './orderConfirm.html',
    styleUrls: ['./orderConfirm.scss'],
    imports: [TranslateModule, CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
})
export class OrderConfirm extends AbstractAppPage implements OnInit {
    OrderMode = OrderMode;

    wayList = computed(() => diningWayList);

    selectedWayValue = signal<string>('');

    userForm: FormGroup;
    // 验证码倒计时
    codeTimer = 0;
    // 验证码按钮是否可点击
    isCodeBtnDisabled = false;

    private curWayValue = computed(() => this.modelStateService.curWayValue());
    getDiningPeople = computed(() => this.homeService.getDiningPeople());
    constructor(
        private Location: Location,
        private readonly appUrlService: AppUrlService,
        private homeService: HomeService,
        private modelStateService: ModelStateService,
        private fb: FormBuilder,
        private toastCtrl: ToastController,
        private modalCtrl: ModalController,
        private AppUrlService: AppUrlService,
    ) {
        super();
        addIcons({ chevronBackOutline, location, chevronForwardOutline });

        this.userForm = this.fb.group({
            name: [
                '',
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(10),
                    Validators.pattern(/^[\u4e00-\u9fa5a-zA-Z]+$/),
                ],
            ],
            phone: ['', [Validators.required]],
            code: [
                '',
                [Validators.required, Validators.maxLength(6), Validators.pattern(/^\d{6}$/)],
            ],
        });
    }

    ngOnInit(): void {
        this.selectedWayValue.set(this.curWayValue());
    }

    onDiningTypeChange(event: any) {
        this.modelStateService.setCurWay(event.detail.value);
    }

    navigateToStoreDetail() {
        this.router.navigate([this.AppUrlService.getPageUrlValue('PAGE_STORE_DETAIL')]);
    }

    back() {
        this.Location.back();
    }

    get formControls() {
        return this.userForm.controls;
    }

    // 发送验证码
    sendCode() {
        if (this.formControls['phone'].invalid) {
            this.formControls['phone'].markAsTouched();
            return;
        }

        // 开始倒计时
        this.codeTimer = 60;
        this.isCodeBtnDisabled = true;
        const timer = setInterval(() => {
            this.codeTimer--;
            if (this.codeTimer <= 0) {
                clearInterval(timer);
                this.isCodeBtnDisabled = false;
            }
        }, 1000);

        this.showToast('验证码已发送至您的手机');
    }

    private async showToast(message: string) {
        const toast = await this.toastCtrl.create({
            message,
            duration: 2000,
            position: 'bottom',
            cssClass: 'custom-toast',
        });
        toast.present();
    }

    getErrorMsg(controlName: string): string {
        const control = this.formControls[controlName];
        if (!control.touched) return '';

        if (controlName === 'name') {
            if (control.errors?.['required']) return 'order.nameRequired';
            if (control.errors?.['minlength']) return 'order.nameMinLength';
            if (control.errors?.['maxlength']) return 'order.nameMaxLength';
            if (control.errors?.['pattern']) return 'order.namePattern';
        }

        // 手机号错误信息
        if (controlName === 'phone') {
            if (control.errors?.['required']) return 'order.phoneRequired';
            if (control.errors?.['pattern']) return 'order.phonePattern';
        }

        // 验证码错误信息
        if (controlName === 'code') {
            if (control.errors?.['required']) return 'order.codeRequired';
            if (control.errors?.['pattern']) return 'order.codePattern';
        }

        return '';
    }

    async openTimeSelect() {
        const modal = await this.modalCtrl.create({
            component: TimeSelectComponent,
            cssClass: 'custom-time-modal',
        });
        await modal.present();

        // 获取选择结果
        const { data } = await modal.onWillDismiss();
        if (data) {
            console.log('选择的时间：', data); // { label: '今日(周三)', time: '立即取 | 10:48', isToday: true }
        }
    }
}
