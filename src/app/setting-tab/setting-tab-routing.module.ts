import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingTabPage } from './setting-tab.page';

const routes: Routes = [
  {
    path: '',
    component: SettingTabPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingTabPageRoutingModule {}
