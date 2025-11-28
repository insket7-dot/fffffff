import { EventNameEnum } from '@rydeen/angular-framework';

/** 全局应用事件 */
export class AppEvent extends EventNameEnum {
    /** 控制全局加载遮罩显隐 */
    static SHOW_GLOBAL_LOADING = new AppEvent('SHOW_GLOBAL_LOADING', 'app.showGlobalLoading');

    /** 语言切换 */
    static readonly EVENT_LANGUAGES = new AppEvent('EVENT_LANGUAGES', 'event_languages');
    /** 语言切换刷新 */
    static readonly EVENT_LANGUAGES_REFRESH = new AppEvent(
        'EVENT_LANGUAGES_REFRESH',
        'event_languages_refresh',
    );
    /** 帮助 */
    static readonly EVENT_HELP_FEEDBACK = new AppEvent(
        'EVENT_HELP_FEEDBACK',
        'event_help_feedback',
    );
    /** 登出 */
    static readonly EVENT_LOGOUT = new AppEvent('EVENT_LOGOUT', 'event_logout');
    /** 页面刷新 */
    static readonly EVENT_PAGE_REFRESH = new AppEvent('EVENT_PAGE_REFRESH', 'event_page_refresh');

    private constructor(name: string, value: string) {
        super(name, value);
    }
}
