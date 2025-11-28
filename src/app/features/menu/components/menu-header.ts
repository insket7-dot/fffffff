import { Component, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { LanguageSelectorComponent } from '@app/shared/components/language-selector/language-selector';

@Component({
  selector: 'app-menu-header',
  templateUrl: './menu-header.html',
  styleUrls: ['./menu-header.scss'],
  standalone: true,
  imports: [TranslateModule, IonicModule, LanguageSelectorComponent],
})
export class MenuHeaderComponent {
  // 活动展开状态
  isExpanded = signal(false);

  /**
   * 切换活动展开状态
   */
  toggleActivity() {
    this.isExpanded.update(prev => !prev);
  }

  /**
   * 关闭活动展开
   */
  closeActivity() {
    this.isExpanded.set(false);
  }
}