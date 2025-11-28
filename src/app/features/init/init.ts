import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AppStoreService } from '@app/shared/services/data/app.store.service';
import { ModelStateService } from '@app/shared/services/data/model-state.service';

@Component({
  selector: 'app-init',
  standalone: true,
  imports: [],
  template: '',
  styleUrl: './init.scss'
})
export class Init implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appStoreService: AppStoreService,
    private modelStateService: ModelStateService
  ) {}

  async ngOnInit() {
    // 读取URL参数
    this.route.queryParams.subscribe(async (params) => {
      console.log('URL参数:', params);
      
      // 提取门店编码参数（假设参数名为storeCode）
      const storeCode = params['storeCode'] || '';
      if (storeCode) {
        console.log('读取到门店编码:', storeCode);
        // 存储门店编码到ModelStateService
        this.modelStateService.setStoreCode(storeCode);
      }
      
      // 初始化门店数据
      await this.appStoreService.init();
      
      // 获取门店基础信息
      const storeBaseInfo = this.appStoreService.storeBaseInfoValue();
      
      if (storeBaseInfo) {
        console.log('门店数据加载成功:', storeBaseInfo);
        // 跳转到home页面
        this.router.navigate(['/home']);
      } else {
        console.error('门店数据加载失败');
        // 即使失败也跳转到home页面
        this.router.navigate(['/home']);
      }
    });
  }
}
