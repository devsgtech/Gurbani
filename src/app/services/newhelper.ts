
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
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

    constructor(
        private platform: Platform, 
        private sqlite: SQLite, 
        private httpClient: HttpClient,
        private sqlPorter: SQLitePorter,
        public toastController: ToastController,
        private file: File,
      ){}
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
}