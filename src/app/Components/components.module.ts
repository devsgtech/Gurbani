import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ListComponent} from './list/list.component';
import {PipesModule} from '../Pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    ReactiveFormsModule, FormsModule, PipesModule,
  ],
    declarations: [
      ListComponent
    ],
    exports: [
      ListComponent
    ]
})
export class ComponentsModule { }
