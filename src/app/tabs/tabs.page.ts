import { Component, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonTabs } from '@ionic/angular';
import { HelperService } from '../services/helper.service';
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  @ViewChild('myTabs') tabs: IonTabs;

  activeTabName = '';
  showcut = false;
  constructor( private modalController: ModalController,
               private helper: HelperService,
       ) {}

  getSelectedTab(){
    this.activeTabName = this.tabs.getSelected();
    console.log('ttt', this.activeTabName);
    this.showcut = this.activeTabName === 'tab1';
  }
}
