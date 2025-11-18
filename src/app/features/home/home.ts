import { Component, OnInit } from '@angular/core';
import { AbstractAppPage } from '@app/shared/abstracts/abstract.app.page';
import { HomeService } from './service/home.service';
import { IonCol, IonContent, IonGrid, IonRow } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  imports: [IonContent, IonGrid, IonRow, IonCol],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home extends AbstractAppPage implements OnInit {
  constructor(private homeService: HomeService) {
    super();
  }

  ngOnInit() {
    this.homeService.init();
  }
}
