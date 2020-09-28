import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AngListPageRoutingModule } from './ang-list-routing.module';

import { AngListPage } from './ang-list.page';
import { ComponentsModule } from 'src/app/Components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AngListPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [AngListPage]
})
export class AngListPageModule {}
