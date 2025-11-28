import {
    Component,
    OnInit,
    OnDestroy,
    Inject,
    Input,
    HostListener,
    ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService, LanguageOption } from '../../../core/services/language.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-language-selector',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="custom-language-selector" [style.width]="width">
            <!-- 下拉按钮：包含地球图标和当前语言 -->
            <div
                class="dropdown-button"
                [ngClass]="{ expanded: isDropdownOpen }"
                (click)="toggleDropdown($event)"
            >
                <span class="globe-icon">🌐</span>
                <span class="current-language">{{ currentLanguageNativeName }}</span>
                <span class="arrow-icon"
                    >@if (isDropdownOpen) {
                    <img src="/assets/image/icon_up1.png" />
                    } @else {
                    <img src="/assets/image/icon_down.png" />
                    }
                </span>
            </div>

            <!-- 下拉选项列表 -->
             @if(isDropdownOpen) {
                 <div class="dropdown-options">
                     @for (language of availableLanguages; track language.code) {
                     <div
                         class="dropdown-option"
                         [class.active]="language.code === currentLanguage"
                         (click)="selectLanguage(language.code)"
                     >
                         {{ language.nativeName }}
                     </div>
                     }
                 </div>
             }
        </div>
    `,
    styleUrls: ['./language-selector.scss'],
})
export class LanguageSelectorComponent implements OnInit, OnDestroy {
    availableLanguages: LanguageOption[] = [];
    currentLanguage: string = 'zh-cn';
    currentLanguageNativeName: string = '中文';
    isDropdownOpen: boolean = false;

    private destroy$ = new Subject<void>();

    @Input() width?: string;
    @Input() height?: string;

    constructor(
        @Inject(LanguageService) private languageService: LanguageService,
        private elementRef: ElementRef
    ) {}

    ngOnInit(): void {
        this.availableLanguages = this.languageService.getAvailableLanguages();

        this.languageService.currentLanguage$
            .pipe(takeUntil(this.destroy$))
            .subscribe((languageCode: string) => {
                this.currentLanguage = languageCode;
                const lang = this.availableLanguages.find((l) => l.code === languageCode);
                this.currentLanguageNativeName = lang ? lang.nativeName : 'Unknown';
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    // 切换下拉展开/收起
    toggleDropdown(event: Event) {
        event.stopPropagation(); // 防止事件冒泡
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    // 选择语言
    selectLanguage(languageCode: string) {
        this.languageService.setLanguage(languageCode);
        this.isDropdownOpen = false;
    }

    // 点击外部区域关闭下拉
    @HostListener('document:click')
    onDocumentClick() {
        this.isDropdownOpen = false;
    }
}
