import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AngListPage } from './ang-list.page';

const routes: Routes = [
  {
    path: '',
    component: AngListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AngListPageRoutingModule {}
