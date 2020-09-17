
import { Injectable } from '@angular/core';
import {LoadingController, Platform} from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject} from 'rxjs';
import { ToastController } from '@ionic/angular';
import { VARS } from './constantString';
import { File } from '@ionic-native/file/ngx';

@Injectable({
  providedIn: 'root'
})

export class newhelper {
  event$: BehaviorSubject<any> = new BehaviorSubject(null);

  loading;
    constructor(
        private platform: Platform,
        private httpClient: HttpClient,
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
    try { this.loadingCtrl.dismiss().catch(() => {}); } catch (e) {}
  }
      async presentToastWithOptions(data, position: any = 'top') {
        const toast = await this.toastController.create({
          header: data,
          position,
          duration: 2000,
          cssClass: 'myIonicToast',
          buttons: [
            {
              text: 'Ok',
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
