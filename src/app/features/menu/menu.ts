import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuFacadeService } from '../../shared/services/ui/menu-facade.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { CategoryOperation } from '../../shared/constants/menu.constants';
import { CartSummaryComponent } from '@app/shared/components/cart-summary/cart-summary';
import { MenuHeaderComponent } from '@/app/features/menu/components/menu-header/menu-header';
import { I18nFieldPipe, PriceI18nPipe } from '@app/shared/pipes/i18n-field.pipe';
import { restaurantOutline,addCircle,removeCircle } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { MenuData, menuListItem } from '@app/shared/types/menu.shared.types';
import { DetailsComponent } from './components/details/details';
import { AppUrlService } from '@app/shared/services/util/app.url.service';
import { AbstractAppPage } from '@/app/shared/abstracts/abstract.app.page';



@Component({
    selector: 'app-menu',
    templateUrl: './menu.html',
    styleUrls: ['./menu.scss'],
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        IonicModule,
        CartSummaryComponent,
        MenuHeaderComponent,
        I18nFieldPipe,
        PriceI18nPipe,
        DetailsComponent
    ],
})
export class Menu  extends AbstractAppPage implements OnInit {
    private menuFacadeService = inject(MenuFacadeService);
    private translateService = inject(TranslateService);

    // 菜单数据
    menuData = this.menuFacadeService.menuValue;

    currentCategory = computed(() => this.menuFacadeService.currentCategoryValue());
    currentMenu = this.menuFacadeService.currentMenuValue;

    readonly showDetails = signal<boolean>(false);

    detailProductId: string | null = null;

    constructor(private AppUrlService: AppUrlService) {
        super()
        addIcons({ restaurantOutline,addCircle,removeCircle });
    }

    ngOnInit() {
        // 初始化菜单数据 - MenuFacadeService不需要init方法
    }

    /**
     * 选择分类
     */
    selectCategory(categoryId: string) {
        this.menuFacadeService.setCurrentCategoryByClick(categoryId);
    }

    /**
     * 向上切换分类
     */
    categoryUp() {
        this.menuFacadeService.categoryUpDown(CategoryOperation.PREV);
    }

    /**
     * 向下切换分类
     */
    categoryDown() {
        this.menuFacadeService.categoryUpDown(CategoryOperation.NEXT);
    }

     openDetail(item: menuListItem) {
        this.detailProductId = item.productId;
        this.showDetails.set(true);
    }

    closeDetail() {
        this.showDetails.set(false);
        this.detailProductId = null;
    }

     openCart() {

    }

    orderConfirm() {
        this.router.navigate([this.AppUrlService.getPageUrlValue('PAGE_ORDER_CONFIRM')]);
    }
}
