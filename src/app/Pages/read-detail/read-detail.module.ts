import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReadDetailPageRoutingModule } from './read-detail-routing.module';

import { ReadDetailPage } from './read-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReadDetailPageRoutingModule
  ],
  declarations: [ReadDetailPage]
})
export class ReadDetailPageModule {}
