import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SettingTabPageRoutingModule } from './setting-tab-routing.module';
import { SettingTabPage } from './setting-tab.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingTabPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [SettingTabPage]
})
export class SettingTabPageModule {}
