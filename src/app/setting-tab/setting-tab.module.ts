import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingTabPageRoutingModule } from './setting-tab-routing.module';

import { SettingTabPage } from './setting-tab.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingTabPageRoutingModule
  ],
  declarations: [SettingTabPage]
})
export class SettingTabPageModule {}
