
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Song } from './song';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

export class newhelper {

    constructor(
        private platform: Platform, 
        private sqlite: SQLite, 
        private httpClient: HttpClient,
        private sqlPorter: SQLitePorter,
        public toastController: ToastController,
      ){}

      async presentToastWithOptions(data) {
        const toast = await this.toastController.create({
          header: data,
          position: 'bottom',
          duration: 2000,
          buttons: [
            {
              text: 'Done',
              role: 'cancel',
              handler: () => {
                console.log('Toast Cancel clicked');
              }
            }
          ]
        });
        toast.present();
      }
}