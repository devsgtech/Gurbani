
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { FileTransferObject ,FileTransfer } from '@ionic-native/file-transfer/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { File } from '@ionic-native/file/ngx';

@Injectable({
  providedIn: 'root'
})

export class downloadData {
    constructor(public platform: Platform,
        private file: File,
        private transfer: FileTransfer,
        private androidPermissions: AndroidPermissions,
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

      
  

}