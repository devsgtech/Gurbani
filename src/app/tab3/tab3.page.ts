import { Component, OnInit } from '@angular/core';
// import { Downloader, DownloadRequest, NotificationVisibility } from '@ionic-native/downloader/ngx';
// import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
// import { File } from '@ionic-native/file';
// import { Platform } from '@ionic/angular';
// import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { UploaderService } from '../services/uploader.service';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{

  tilesArray = [
    {
      punjabiWord: 'ਜਪੁਜੀ ਸਾਹਿਬ',
      englishWord: 'Japji Sahib'
    },
    {
      punjabiWord: 'ਜਾਪ ਸਾਹਿਬ ',
      englishWord: 'Jaap Sahib'
    },
    {
      punjabiWord: 'ਤ੍ਵਪ੍ਰਸਾਦਿ ਸ੍ਵਯੇ ',
      englishWord: 'Tav Prasad'
    },
    {
      punjabiWord: 'ਚੌਪਈ ਸਾਹਿਬ',
      englishWord: 'Chaupai Sahib'
    },
    {
      punjabiWord: 'ਅਨੰਦੁ',
      englishWord: 'Anand Sahib'
    }
  
  ]

  constructor(
    // private downloader: Downloader,private transerobj: FileTransferObject,
    // private platform: Platform,private androidPermissions: AndroidPermissions,
    // private transfer: FileTransfer, private file: File,
    public upload: UploaderService,
    ) { 
    }

  ngOnInit() {
  }

  // download(){
  //   console.log('download cClick ');

  //   const url = 'https://firebasestorage.googleapis.com/v0/b/testgurubani.appspot.com/o/splash.png?alt=media&token=218b62eb-0311-4125-b34e-becfd12886aa';
    
  //   this.transerobj.download(url, this.file.dataDirectory ).then((entry) => {
  //   console.log('download complete: ' + entry.toURL());
  // }, (error) => {
  //   // handle error
  //   console.log('error',error);
  // });
  // }


  downloadFile( ) {
    const myFileName = null
    const url = 'https://firebasestorage.googleapis.com/v0/b/testgurubani.appspot.com/o/splash.png?alt=media&token=218b62eb-0311-4125-b34e-becfd12886aa';
    this.upload.downloadFile(url);
    console.log(url,'url');
  }

}