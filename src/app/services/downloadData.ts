
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

createParentDirectory(sf, i, dd){
   return this.file.createDir(this.file.externalRootDirectory, 'shabad', false).then(response => {
       return this.createSubDir(sf, i, dd);
      }).catch(err => {
        if (err.message == 'PATH_EXISTS_ERR') {
          this.createSubDir(sf, i, dd)
        }
      });
}

createSubDir(sf, i, dd) {
    let ang_id = 1;
   return this.file.createDir(this.file.externalRootDirectory + 'shabad', 'ang_' + ang_id, false).then(response => {
      console.log('Ang Directory created', response);
      return this.newDownLoadAudioFile(sf, i, dd)
    }).catch(err => {
      console.log('Could not create directory "my_downloads" ', err);
      if (err.message == 'PATH_EXISTS_ERR') {
        return this.newDownLoadAudioFile(sf, i, dd)
      }
    });
  }

newDownLoadAudioFile(sf, i, dd){
    let ang_id = 1;
    let shabad_id = i + 1;
    let url = 'https://firebasestorage.googleapis.com/v0/b/testgurubani.appspot.com/o/ang_' + ang_id + '%2Fshabad_' + shabad_id + '.mp3?alt=media&token=fcfe83f3-f21c-4d77-a4b8-438f0e53281a'
    const fileTransfer: FileTransferObject = this.transfer.create();
       return fileTransfer.download(url, this.file.externalRootDirectory + '/shabad/' + 'ang_' + ang_id + '/shabad_' + shabad_id + '.mp3').then((entry) => {
          let nurl = this.file.externalRootDirectory + '/shabad/' + 'ang_' + ang_id + '/shabad_' + shabad_id + '.mp3';
          return nurl;
        })
          .catch((err) => {
              return err
          });
  }

}