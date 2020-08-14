
import { Injectable } from '@angular/core';
import {LoadingController, Platform} from '@ionic/angular';
import { Song } from './song';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { ToastController } from '@ionic/angular';
import { VARS } from './constantString';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';

@Injectable({
  providedIn: 'root'
})

export class newhelper {
  event$: BehaviorSubject<any> = new BehaviorSubject(null);

  loading;
    constructor(
        private platform: Platform, 
        private sqlite: SQLite, 
        private httpClient: HttpClient,
        private sqlPorter: SQLitePorter,
        public toastController: ToastController,
        private file: File,
        private loadingCtrl: LoadingController ){}
      createShabad(storageDirectory) {
        this.file.createDir(storageDirectory, VARS.shabadDirectory, false).then(response => {
          return  'yes';
        }).catch(err => {
          if (err.message == 'PATH_EXISTS_ERR') {
            return  'yes';
          } else{
            return  'no';
          }
        });
      }
  async presentLoadingWithOptions(msg= 'Please wait a moment', customCssClass= 'myLoader') {
    this.dismissLoading();
    this.loading = await this.loadingCtrl.create({
      id: 'myLoader',
      spinner: 'bubbles',
      message: msg,
      translucent: true,
      cssClass: customCssClass
    });
    return await this.loading.present();
  }
  dismissLoading() {
    try { this.loading.dismiss().catch(() => {}); } catch (e) {}
  }

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

      returnDownloadUrl(ang_id, _id){
        return VARS.firebaseFolder + ang_id + VARS.audioName + _id + VARS.tokeWithExtention;
      }

      static checkEventData(ev, evName = null, data = true) {
        return data ? (ev && ev.eventName  && ev.eventName === evName && ev.data) : (ev && ev.eventName  && ev.eventName === evName);
      }
}
