import {
  ApplicationConfig,
  inject,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import localeZh from '@angular/common/locales/zh-Hans';
import localeEn from '@angular/common/locales/en';
import localeZhTw from '@angular/common/locales/zh-Hant';
import { routes } from './app.routes';
import { TranslateLoader, TranslateModule, TranslationObject } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, switchMap } from 'rxjs';
import { environment } from '@/environments/environment';
import { LanguageService } from '@app/core/services/language.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { APP_URLS } from '@app/core/tokens/app.url.token';
import { AppUrl } from '@app/core/constants/app.url';
import { provideIonicAngular } from '@ionic/angular/standalone';

// 注册本地化数据
registerLocaleData(localeZh, 'zh-cn');
registerLocaleData(localeEn, 'en-us');
registerLocaleData(localeZhTw, 'zh-tw');

/**
 * 自定义翻译加载器
 */
export class CustomTranslateLoader implements TranslateLoader {
  constructor(
    private httpClient: HttpClient,
    public prefix: string = '/assets/i18n/',
    public suffix: string = '.json',
  ) {}

  public getTranslation(lang: string): Observable<TranslationObject> {
    // 统一使用小写语言码，匹配文件名（如 zh-cn.json、en-us.json）
    const normalized = String(lang || '').toLowerCase();
    const base = this.prefix.endsWith('/') ? this.prefix : `${this.prefix}/`;
    return this.httpClient
      .get<TranslationObject>(`${base}${normalized}${this.suffix}`)
      .pipe(switchMap((translations) => of(translations)));
  }
}

/**
 * 创建自定义翻译加载器工厂函数
 */
export function createTranslateLoader(http: HttpClient): TranslateLoader {
  return new CustomTranslateLoader(http, environment.i18nPathKey || '/assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes),
    provideBrowserGlobalErrorListeners(),
    provideAnimationsAsync(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    ...TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
      fallbackLang: 'zh-cn',
    }).providers!,
    LanguageService,
    {
      provide: LOCALE_ID,
      useFactory: () => {
        const languageService = inject(LanguageService);
        return languageService.getCurrentLanguage();
      },
    },
    {
      provide: APP_URLS,
      useValue: AppUrl,
    }, provideIonicAngular({}),
  ],
};
