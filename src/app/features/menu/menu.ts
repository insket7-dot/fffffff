import { Component, OnInit, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuFacadeService } from '../../shared/services/ui/menu-facade.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { CategoryOperation } from '../../shared/constants/menu.constants';
import { CartSummaryComponent } from '@app/shared/components/cart-summary/cart-summary';
import { MenuHeaderComponent } from '@/app/features/menu/components/menu-header';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.html',
  styleUrls: ['./menu.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule, IonicModule, CartSummaryComponent, MenuHeaderComponent],
})
export class Menu implements OnInit {
  private menuFacadeService = inject(MenuFacadeService);
  private translateService = inject(TranslateService);

  // 菜单数据
  menuData = this.menuFacadeService.menuValue;
  currentCategory = this.menuFacadeService.currentCategoryValue;
  currentMenu = this.menuFacadeService.currentMenuValue;

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
}