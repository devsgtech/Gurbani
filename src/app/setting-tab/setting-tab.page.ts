import { Component, OnInit } from '@angular/core';
import { ChangeUIService } from '../services/change-ui.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-setting-tab',
  templateUrl: './setting-tab.page.html',
  styleUrls: ['./setting-tab.page.scss'],
})
export class SettingTabPage implements OnInit {
  theme= 'day';
  font: any = 12;
  constructor(
    public changeui:ChangeUIService,
    private platform: Platform,
  ) { }

  ngOnInit() {
  }

  changeFont(){
    console.log(this.font, 'this.font')
    if(this.font == 12 ){
      this.changeui.fontSize = 'font-12'
    }
    if(this.font == 16 ){
      this.changeui.fontSize = 'font-16'
    }
    if(this.font == 20 ){
      this.changeui.fontSize = 'font-20'
    }
    if(this.font == 24 ){
      this.changeui.fontSize = 'font-24'
    }
  }

  toggleDarkMode(){
    this.changeui.toggleApp();
  }
}
