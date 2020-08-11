
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { FileTransferObject ,FileTransfer } from '@ionic-native/file-transfer/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { File } from '@ionic-native/file/ngx';
import { VARS } from './constantString';
import { newhelper } from './newhelper';

@Injectable({
  providedIn: 'root'
})

export class downloadData {
    constructor(public platform: Platform,
        private file: File,
        private transfer: FileTransfer,
        private androidPermissions: AndroidPermissions,
        private newHelper: newhelper,

       ) {}

       createShabad(sf, i, dd) {
        this.file.createDir(this.file.externalRootDirectory, '.shabad', false).then(response => {
          return  this.createAngDir(sf, i, dd);
        }).catch(err => {
          if (err.message == 'PATH_EXISTS_ERR') {
            return  this.createAngDir(sf, i, dd);
          }
        });
      }

      createAngDir(sf, i, dd) {
        console.log('CreateDirc Function', this.file.externalRootDirectory + '.shabad', 'ang_' + sf.ang_id)
        this.file.createDir(this.file.externalRootDirectory + '.shabad', 'ang_' + sf.ang_id, false).then(response => {
          console.log('Ang Directory created', response);
         return true;
        }).catch(err => {
          console.log('Could not create directory "my_downloads" ', err);
          if (err.message == 'PATH_EXISTS_ERR') {
           return true;
          }
        });
      }


      downloadAudioFile(url, storageDirectory,sf){
        const fileTransfer: FileTransferObject = this.transfer.create();
        fileTransfer.download(url, storageDirectory + '/' + VARS.shabadDirectory +'/' + VARS.angDir + sf.ang_id + '/shabad_' + sf._id + '.mp3').then((entry) => {
          let nurl = storageDirectory + '/' + VARS.shabadDirectory +'/' + VARS.angDir + sf.ang_id + '/shabad_' + sf._id + '.mp3';
          sf.isDownloading = false;
          return nurl;
          // this.ply1(sf, i, dd, nurl);
        })
          .catch((err) => {
            if (err.http_status == 404) {
              sf.isDownloading = false;
              this.newHelper.presentToastWithOptions('File Not Found on Server')
            }
          });
      }
      
  

}