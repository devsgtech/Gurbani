import { Component, OnInit, ViewChild } from '@angular/core';
import { ChangeUIService } from '../services/change-ui.service';
import { shabadDB } from '../services/shabadDB';
import { AlertController, IonInfiniteScroll, Platform } from '@ionic/angular';
import { MediaObject , Media} from '@ionic-native/media/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { File } from '@ionic-native/file/ngx';
import { VARS } from '../services/constantString';
import { newhelper } from '../services/newhelper';
import { FileTransferObject,FileTransfer } from '@ionic-native/file-transfer/ngx';
import { Network } from '@ionic-native/network/ngx';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  getPositionInterval: any;

  currPlayingFile: MediaObject;
  tilesArray = [
    {
      punjabiWord: 'ਜਪੁਜੀ ਸਾਹਿਬ',
      englishWord: 'Japji Sahib',
      id: 1,
    },
    {
      punjabiWord: 'ਅਨੰਦੁ ਸਾਹਿਬ',
      englishWord: 'Anand Sahib',
      id: 2,
    },
    {
      punjabiWord: 'ਸੁਖਮਨੀ ਸਾਹਿਬ',
      englishWord: 'Sukhmani Sahib',
      id: 3,
    },
    {
      punjabiWord: 'ਕੀਰਤਨ ਸੋਹਿਲਾ',
      englishWord: 'Kirtan Sohila',
      id: 4,
    },
    
  ]
  sqlText: any;
  arrayText = [];
  serverFileArray = [];
  serverFileArrayCopy = [];
  sqlScript = '';
  storageDirectory: any;
  listShow : boolean = false;
  online :boolean = true;
  getDurationInterval: any;

  sahibName= '';



  searchOpt = '';
 
  isPlayingAll = false;
  testnextFileIndex = 0;
  offset = 0;
  // searchString = '';
  indexx: any;
  searchOffset = 0;
  backdrop = false;
  raagData: any = [];
  checkDidFilter = false;
  cancelAll = true;
  totalFavourite = 0;
  noRecords = false;
  searchString: any;
  constructor(
    public changeui: ChangeUIService,
    private igdb: shabadDB,
    public platform: Platform,
    private androidPermissions: AndroidPermissions,
    private file: File,
    private newHelper: newhelper,
    private transfer: FileTransfer,
    private network: Network,
    private media: Media,
    public alertController: AlertController,
  ) {
    this.platform.ready().then(() => {
      if (this.platform.is('ios')) {
        this.storageDirectory = this.file.dataDirectory;
      } else if (this.platform.is('android')) {
        this.storageDirectory = this.file.externalDataDirectory;
      }
    });
    this.platform.pause.subscribe(e => {
      this.stopPlayRecording();
    });

    this.online = (this.network.type !== this.network.Connection.NONE);
    this.network.onChange().subscribe((ev) => {
      this.online = (ev.type === 'online');
    });
  }
 
  ngOnInit() {
  }
 
  backToReadTile(){
    this.testnextFileIndex = 0;
    this.listShow = false;
    this.cancelAll = true;
    this.isPlayingAll = false;
    this.stopPlayRecording() 
  }
  
  readBook(item) {
    this.listShow = true;
    let offset = 0;
    let limit = 0;
    let textArray = [];
    this.sahibName = item.punjabiWord;
    switch (item.id) {
      case 1:
        offset = 0;
        limit = 385;
        textArray = [limit, offset]
        this.sqlScript = "SELECT * FROM shabad WHERE source_id='G' LIMIT ? OFFSET ?";
        this.searchFilterDataNotReset(this.sqlScript, textArray)
        break;
      case 2:
        offset = 39313;
        limit = 210;
        textArray = [limit, offset]
        this.sqlScript = "SELECT * FROM shabad WHERE source_id='G' LIMIT ? OFFSET ?";
        this.searchFilterDataNotReset(this.sqlScript, textArray)
        break;
      case 3:
        offset = 11587;
        limit = 2027;
        textArray = [limit, offset]
        this.sqlScript = "SELECT * FROM shabad WHERE source_id='G' LIMIT ? OFFSET ?";
        this.searchFilterDataNotReset(this.sqlScript, textArray)
        break;
      case 4:
          offset = 533;
          limit = 56;
          textArray = [limit, offset]
          this.sqlScript = "SELECT * FROM shabad WHERE source_id='G' LIMIT ? OFFSET ?";
          this.searchFilterDataNotReset(this.sqlScript, textArray)
          break;

    }
  }
 

  loadData(event) {
    let leng = this.serverFileArray.length + 10;
    for (let i = this.serverFileArray.length; i < leng; i++) {
      if(i < this.serverFileArrayCopy.length ){
        this.serverFileArray.push(this.serverFileArrayCopy[i])
      } else{
        event.target.disabled = true;
      }
    }
    console.log('this.serverFileArray Length', this.serverFileArray.length);
    event.target.complete();
  }

  searchFilterDataNotReset(sqlText, arrayText) {
    this.serverFileArrayCopy = [];
    this.serverFileArray = [];
    this.sqlText = sqlText;
    this.arrayText = arrayText;
    this.igdb.commonFilter(sqlText, arrayText).then((res) => {
      console.log('Lenght Of Data', res.length);
      console.log('Response From Common Filter', res);
      res.map(item => {
        item.duration= -1;
        item.position=0,
        item.isFileDownloaded= false,
        item.isDownloading= false,
        this.serverFileArrayCopy.push(item);
      })
      this.pushData();
    })
    this.prepareAudioFile()
  }

  pushData() {
    for (let i = 0; i < 10; i++) {
      this.serverFileArray.push(this.serverFileArrayCopy[i])
    }
  }

 static scrollTo(index) {
    const currentId = document.getElementById('currentPlayItemId' + index);
    currentId.scrollIntoView({ behavior: 'smooth' });
  }
  ionViewDidLeave(){
    this.testnextFileIndex = 0;
    this.newallStop();
  }
  
  ionViewWillLeave() {
    this.testnextFileIndex = 0;
    this.newallStop();
  }
  
  ionViewWillEnter() {
    this.online = (this.network.type !== this.network.Connection.NONE);
    this.network.onChange().subscribe((ev) => {
      this.online = (ev.type === 'online');
    });
    this.newallStop();
    this.testnextFileIndex = 0;
  }
  async checkNetwork() {
    await this.newHelper.presentToastWithOptions(this.online ? 'You are connected to internet, woohoo!' : 'You are not connected to internet!');
  }
  prepareAudioFile(singleFile = []) {
    this.platform.ready().then(() => {
      this.file.resolveDirectoryUrl(this.storageDirectory).then((resolvedDirectory) => {
        let filesArray = this.serverFileArray;
        if (singleFile.length) {
          filesArray = singleFile;
        }
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < filesArray.length; i++) {
          const sFile = filesArray[i];
          this.file.checkFile(resolvedDirectory.nativeURL, sFile.fileName).then((data) => {
            if (data === true) {
              sFile.isFileDownloaded = true;
              sFile.isDownloading = false;
            } else {  // not sure if File plugin will return false. go to download
              console.log('not found--------', i);
            }
          }).catch(async err => {
            console.log('Error occurred while checking local files:', i, err);
            if (err.code === 1) {
              const fileTransfer: FileTransferObject = this.transfer.create();
              fileTransfer.download(sFile.url, this.storageDirectory + sFile.fileName).then((entry) => {
                console.log('download complete', i, sFile.fileName, entry.toURL());
                sFile.isFileDownloaded = true;
                sFile.isDownloading = false;
              }).catch(err2 => {
                console.log('Download error!', i, err2);
              });
            }
          });
        }
      }).catch(e => console.log('e', e));
    }).catch(e => console.log('e0', e));
  }
  createAudioFile(url) {
    return new Promise(resolve => {
      this.currPlayingFile = null;
      if (this.platform.is('ios')) {
        const ss = this.media.create((url).replace(/^file:\/\//, ''));
        return resolve(ss);
      } else {
        const ss = this.media.create(url);
        return resolve(ss);
      }
    });
  }

  setPlayingDefault() {
    // tslint:disable-next-line:prefer-for-of
    this.serverFileArray.map(f => {
      f.isPlaying = false;
      f.isInPlay = false;
      f.duration = -1;
      f.position = 0;
      f.isDownloading = false;
    })
  }
  setDuration(sFile) {
    this.getDurationInterval = setInterval(() => {
      if (sFile.duration == -1) {
        sFile.duration = (this.currPlayingFile.getDuration());  // make it an integer
      } else {
        clearInterval(this.getDurationInterval);
      }
    }, 100);
  }
  setStatus(sFile) {
    return new Promise(resolve => {
      this.setPlayingDefault();
      this.currPlayingFile.onStatusUpdate.subscribe(status => {
        switch (status) {
          case 1:
            sFile.isInPlay = false;
            break;
          case 2:   // 2: playing
            sFile.isInPlay = true;
            sFile.isPlaying = true;
            break;
          case 3:   // 3: pause
            sFile.isInPlay = true;
            sFile.isPlaying = false;
            break;
          case 4:   // 4: stop
            break;
          default:
            sFile.isInPlay = false;
            sFile.isPlaying = false;
            break;
        }
        return resolve(status);
      });
    });
  }
  getAndSetCurrentAudioPosition(sFile, index, isSingle) {
    const diff = 1;
    this.getPositionInterval = setInterval(() => {
      const lastPosition = sFile.position;
      this.currPlayingFile.getCurrentPosition().then(position => {
        if (position >= 0 && position < sFile.duration) {
          if (Math.abs(lastPosition - position) >= diff) {
            this.currPlayingFile.seekTo(lastPosition * 1000);
          } else {
            sFile.position = position;
          }
        } else { // if (position >= sFile.duration)
          this.stopPlayRecording();
          this.testnextFileIndex = index + 1;
          const nextFileIndex = this.testnextFileIndex;
          if (this.serverFileArray.length > nextFileIndex && !isSingle) {
            const nextFile = this.serverFileArray[nextFileIndex];
            this.download( nextFile, nextFileIndex, isSingle);
          }else if (this.serverFileArray.length == nextFileIndex){
            this.testnextFileIndex = 0;
            this.newallStop();
          }
        }
      });
    }, 100);
  }
  playRecording(sFile = null, index = 0, isSingle = false, newUrl = null) {
    Tab3Page.scrollTo(index);
    if (sFile && !sFile.isFileDownloaded) {
      console.log('sFile', sFile.isDownloading, sFile, newUrl);
    }

    let currentPlayFile: any;
    if (sFile) {
      currentPlayFile = sFile;
    } else {
      currentPlayFile = this.serverFileArray[0];
    }
    this.isPlayingAll = !isSingle;
    try {
      this.currPlayingFile.stop();
    } catch (e) {}
    this.createAudioFile(newUrl).then((res: any) => {
      console.log('rere', res);
      this.currPlayingFile = res;
      setTimeout(() => {
        this.currPlayingFile.play();
      }, 0);
      this.setDuration(currentPlayFile);
      this.setStatus(currentPlayFile).then((status) => {
        this.getAndSetCurrentAudioPosition(currentPlayFile, index, isSingle);
      }).catch(() => {});
    }).catch(() => {});
  }


  nextplay() {
    this.testnextFileIndex = this.testnextFileIndex + 1;
    const nextFileIndex = this.testnextFileIndex;
    const nextFile = this.serverFileArray[nextFileIndex];
    const isSingle = false;
    this.download( nextFile, nextFileIndex, isSingle);
    // this.playRecording(nextFile, nextFileIndex, isSingle);
  }

  prevplay() {
    this.testnextFileIndex = this.testnextFileIndex - 1;
    const nextFileIndex = this.testnextFileIndex;
    const nextFile = this.serverFileArray[nextFileIndex];
    const isSingle = false;
    this.download( nextFile, nextFileIndex, isSingle);

    // this.playRecording(nextFile, nextFileIndex, isSingle);
  }
playAll(){
  this.isPlayingAll = true;
  this.cancelAll = false;
  // this.testnextFileIndex = 0;
  // this.playRecording();
  this.download( null, this.testnextFileIndex, false);
}
newallStop(){
  this.isPlayingAll =  false;
  this.stopPlayRecording();
}
  stopPlayRecording() {
    try {
      if(this.currPlayingFile){
      this.currPlayingFile.stop();
      this.currPlayingFile.release();
     }
    } catch (e) {}
    clearInterval(this.getDurationInterval);
    clearInterval(this.getPositionInterval);
    this.setPlayingDefault();
  }

  pausePlayRecording(sFile) {
    sFile.isPlaying = false;
    this.currPlayingFile.pause();
    this.currPlayingFile.getDuration();
  }

  getProgressVal(e, f , sf) {
    return parseFloat((e / f).toFixed(3));
  }
///////////////// DB Search///////////////////////


///////////////// DB Search End///////////////////
///////////////// LOAD DATA From DB///////////////////////////

firstWordSearch(ev) {
  this.stopPlayRecording();
  this.infiniteScroll.disabled = false;
  this.searchOffset = 0;
  this.searchString = ev.target.value.trim();
  this.igdb.searchShabadFirstWord(this.searchString).then((res) => {
    console.log('Resopnse GetData0', res);
    this.serverFileArray = res;
    this.serverFileArrayCopy = this.serverFileArray;
  });

}

//////////////// LOAD DATA FROM DB END//////////////////////
cancelAllAndPlayOne(sf, i, dd){
  this.cancelDownload();
  this.testnextFileIndex = 0;
  this.cancelAll = true;
  this.isPlayingAll = false;
  try {
    if(this.currPlayingFile){
      this.currPlayingFile.stop();
      this.currPlayingFile.release();
    }
  } catch (e) {}
  this.download(sf, i, dd);
}

async download(sf, i, dd) {
  try {
    this.stopPlayRecording();
  } catch (e) {}
  sf = this.serverFileArray[i];
  console.log('SfFull Data', sf);
  await this.platform.ready();
  if (this.platform.is('android')) {
    this.androidPermissions.hasPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
      .then(status => {
        if (status.hasPermission) {
          this.createShabad(sf, i, dd);
        } else {
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
            .then(status => {
              if (status.hasPermission) {
                this.createShabad(sf, i, dd);
              }
            });
        }
      });
  } else if (this.platform.is('ios')) {
    this.createShabad(sf, i, dd);
  }
}

 createShabad(sf, i, dd) {
  this.file.createDir(this.storageDirectory, VARS.shabadDirectory, false).then(response => {
    this.createAngDir(sf, i, dd);
  }).catch(err => {
    if (err.message == 'PATH_EXISTS_ERR') {
      this.createAngDir(sf, i, dd);
    }
  });
}

createAngDir(sf, i, dd) {
  this.file.createDir(this.storageDirectory + VARS.shabadDirectory, VARS.angDir + sf.ang_id, false).then(response => {
    this.downloadAudioFile(sf, i, dd);
  }).catch(err => {
    if (err.message == 'PATH_EXISTS_ERR') {
      this.downloadAudioFile(sf, i, dd);
    }
  });
}


downloadAudioFile(sf, i, dd) {
  console.log('check', this.cancelAll, 'this.cancelAll  ', sf, 'sf'  , dd, ' dd');
  const checkFileUrl = this.storageDirectory + '/' + VARS.shabadDirectory + '/' + VARS.angDir + sf.ang_id + '/';
  const FileName = 'shabad_' + sf._id + '.mp3';
  this.file.checkFile(checkFileUrl, FileName).then((entry) => {
    const nurl = this.storageDirectory + '/' + VARS.shabadDirectory + '/' + VARS.angDir + sf.ang_id + '/shabad_' + sf._id + '.mp3';
    sf.isDownloading = false;

    if (this.cancelAll == false && dd == false){
      console.log('onecancelAll', this.cancelAll, 'this.cancelAll  ', sf, 'sf' );
      setTimeout(() => {
        this.playRecording(sf, i, dd, nurl);
      }, 500);
    }
    if (this.cancelAll && dd == true){
    setTimeout(() => {
      this.playRecording(sf, i, dd, nurl);
    }, 500);
   }

  })
    .catch((err) => {
     const url = this.newHelper.returnDownloadUrl(sf.ang_id, sf._id);
     const fileTransfer: FileTransferObject = this.transfer.create();
     if (!this.online){
        this.checkNetwork();
      } else{
        sf.isDownloading = true;
        Tab3Page.scrollTo(i);
        fileTransfer.download(url, this.storageDirectory + '/' + VARS.shabadDirectory + '/' + VARS.angDir + sf.ang_id + '/shabad_' + sf._id + '.mp3').then((entry) => {
        const nurl = this.storageDirectory + '/' + VARS.shabadDirectory + '/' + VARS.angDir + sf.ang_id + '/shabad_' + sf._id + '.mp3';
        sf.isDownloading = false;

        console.log('Inside Download For Play', this.cancelAll, 'this.cancelAll  ', sf, 'sf' );
        if (this.cancelAll == false && dd == false){
          console.log('TwocancelAll', this.cancelAll, 'this.cancelAll  ', sf, 'sf' );
          setTimeout(() => {
            this.playRecording(sf, i, dd, nurl);
          }, 500);
        }
        if (this.cancelAll && dd == true){
        setTimeout(() => {
          this.playRecording(sf, i, dd, nurl);
        }, 500);
       }
      })
        .catch((err) => {
          if (err.http_status == 404) {
            sf.isDownloading = false;

            if (this.isPlayingAll){

              this.presentAlertConfirm();
            } else {
              this.newHelper.presentToastWithOptions('Shabad Not Found on Server');
            }
          }
        });
      }
    });

}

async presentAlertConfirm() {
  const alert = await this.alertController.create({
    header: 'Shabad Not Found on Server!',
    buttons: [
      {
        text: 'Stop',
        role: 'cancel',
        cssClass: 'cancelAlert',
        handler: (blah) => {
          this.newallStop();
        }
      }, {
        text: 'Play Next',
        cssClass: 'playAlert',
        handler: () => {
          this.nextplay();
        }
      }
    ]
  });
  await alert.present();
}

cancelDownload(){
  try {
    const fileTransfer: FileTransferObject = this.transfer.create();
    fileTransfer.abort();
  } catch (e) {}
}
onPlay(sf, i) {
  this.cancelAllAndPlayOne(sf, i, true);
}


}
