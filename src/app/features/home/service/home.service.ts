import { Injectable } from '@angular/core';
import { AppUrlService } from '@app/shared/services/util/app.url.service';

@Injectable({ providedIn: 'root' })
export class HomeService {
    constructor(private appUrlService: AppUrlService) {}

    init() {
        console.log('HomeService init');
        console.log(this.appUrlService.getPageUrlValue('PAGE_HOME'));
    }
}
