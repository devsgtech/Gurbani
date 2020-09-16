import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReadDetailPage } from './read-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ReadDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReadDetailPageRoutingModule {}
