import { Component, OnInit } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';

// 时间选项类型
interface TimeOption {
  label: string;
  time: string;
  isToday: boolean;
}

@Component({
  selector: 'app-time-select',
  templateUrl: './time-select.component.html',
  styleUrls: ['./time-select.component.scss'],
  imports: [IonicModule],
})
export class TimeSelectComponent implements OnInit {


  constructor(private modalCtrl: ModalController) {

  }

  ngOnInit() {

  }

}
