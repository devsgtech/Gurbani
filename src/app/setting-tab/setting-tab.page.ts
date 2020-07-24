import { Component, OnInit } from '@angular/core';
import { ChangeUIService } from '../services/change-ui.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-setting-tab',
  templateUrl: './setting-tab.page.html',
  styleUrls: ['./setting-tab.page.scss'],
})
export class SettingTabPage implements OnInit {
  font: any = 12;
  dd:any = 1;
  true = true;
  false = false;
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
change(){
  console.log(this.dd,'sdf')
  let data_ = this.dd==1 ? false : this.true; 
  console.log(data_,'data_')

  this.changeui.setAppTheme(data_);
}
  // toggleDarkMode(){
  //   this.changeui.toggleApp();
  // }
}
