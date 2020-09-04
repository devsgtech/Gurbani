import { Component, OnInit, ViewChild } from '@angular/core';
import { ChangeUIService } from '../services/change-ui.service';
import { shabadDB } from '../services/shabadDB';
import { IonInfiniteScroll, Platform } from '@ionic/angular';
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
    }
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
  constructor(
    public changeui: ChangeUIService,
    private igdb: shabadDB,
    public platform: Platform,
    private androidPermissions: AndroidPermissions,
    private file: File,
    private newHelper: newhelper,
    private transfer: FileTransfer,
    private network: Network,
    private media: Media
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
  }
  static scrollTo(index) {
    const currentId = document.getElementById('currentPlayItemId' + index);
    currentId.scrollIntoView({ behavior: 'smooth' });
  }
  ngOnInit() {
  }
  ionViewWillEnter() {
    this.online = (this.network.type !== this.network.Connection.NONE);
    this.network.onChange().subscribe((ev) => {
      this.online = (ev.type === 'online');
    });
  }
  backToReadTile(){
    this.listShow = false;
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

    }
  }
  ionViewWillLeave() {
    this.stopPlayRecording() 
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


  async download(sf, i, dd) {
    try {
      this.stopPlayRecording();
    } catch (e) {}
    sf = this.serverFileArray[i];
    console.log('SfFull Data', sf)
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
        this.createAngDir(sf, i, dd)
      }
    });
  }
  
  createAngDir(sf, i, dd) {
    this.file.createDir(this.storageDirectory + VARS.shabadDirectory, VARS.angDir + sf.ang_id, false).then(response => {
      this.downloadAudioFile(sf, i, dd)
    }).catch(err => {
      if (err.message == 'PATH_EXISTS_ERR') {
        this.downloadAudioFile(sf, i, dd)
      }
    });
  }
  
  
  downloadAudioFile(sf, i, dd) {
    let checkFileUrl = this.storageDirectory + '/'+ VARS.shabadDirectory + '/' + VARS.angDir + sf.ang_id + '/';
    let FileName = 'shabad_' + sf._id + '.mp3';
    this.file.checkFile(checkFileUrl, FileName).then((entry) => {
      let nurl = this.storageDirectory + '/' + VARS.shabadDirectory+ '/' + VARS.angDir + sf.ang_id + '/shabad_' + sf._id + '.mp3';
      sf.isDownloading = false;
     
      
     
      setTimeout(() => {
        this.playRecording(sf, i, dd,nurl)
      }, 500);
    
  
    })
      .catch((err) => {
       const url = this.newHelper.returnDownloadUrl(sf.ang_id, sf._id);
        const fileTransfer: FileTransferObject = this.transfer.create();
        if(!this.online){
          this.checkNetwork();
        } else{
          sf.isDownloading = true;
        fileTransfer.download(url, this.storageDirectory + '/' + VARS.shabadDirectory +'/' + VARS.angDir + sf.ang_id + '/shabad_' + sf._id + '.mp3').then((entry) => {
          let nurl = this.storageDirectory + '/' + VARS.shabadDirectory +'/' + VARS.angDir + sf.ang_id + '/shabad_' + sf._id + '.mp3';
          sf.isDownloading = false;
          setTimeout(() => {
            this.playRecording(sf, i, dd,nurl)
          }, 500);
        })
          .catch((err) => {
            if (err.http_status == 404) {
              sf.isDownloading = false;
              this.newHelper.presentToastWithOptions('File Not Found on Server')
            }
          });
        }
      });
    
  }
  async checkNetwork() {
    await this.newHelper.presentToastWithOptions(this.online ? 'You are connected to internet, woohoo!' : 'You are not connected to internet!');
  }
  stopPlayRecording() {
    if(this.currPlayingFile){
      this.currPlayingFile.stop();
      this.currPlayingFile.release();
    }
    clearInterval(this.getDurationInterval);
    clearInterval(this.getPositionInterval);
    this.setPlayingDefault();
   
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
   
    try {
      this.currPlayingFile.stop();
    } catch (e) {}
    this.createAudioFile(newUrl).then((res: any) => {
      console.log('rere', res);
      this.currPlayingFile = res;
      setTimeout(() => {
        this.currPlayingFile.play();
      }, 100)
      this.setDuration(currentPlayFile);
      this.setStatus(currentPlayFile).then((status) => {
        this.getAndSetCurrentAudioPosition(currentPlayFile, index, isSingle);
      }).catch(() => {});
    }).catch(() => {});
  }
  // playRecording(sFile = null, index = 0, isSingle = false, newUrl = null) {
  //   Tab3Page.scrollTo(index);
  //   if (sFile && !sFile.isFileDownloaded) {
  //     // sFile.isDownloading = true;
  //     console.log('sFile', sFile.isDownloading, sFile);
  //     // this.prepareAudioFile([sFile]);
  //   }
    
  //   let currentPlayFile: any;
  //   if (sFile) {
  //     currentPlayFile = sFile;
  //   } else {
  //     currentPlayFile = this.serverFileArray[0];
  //   }
   
  //   this.currPlayingFile = this.createAudioFile(newUrl)
  //   // this.currPlayingFile = this.createAudioFile(this.storageDirectory, currentPlayFile.fileName);

  //   // this.currPlayingFile = this.createAudioFile(this.storageDirectory, currentPlayFile.fileName);
  //   this.currPlayingFile.play();
  //   this.setDuration(currentPlayFile);
  //   this.setStatus(currentPlayFile);
  //   this.getAndSetCurrentAudioPosition(currentPlayFile, index, isSingle);
  // }
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
  setDuration(sFile) {
    this.getDurationInterval = setInterval(() => {
      // tslint:disable-next-line:triple-equals
      if (sFile.duration == -1) {
        // tslint:disable-next-line:no-bitwise
        // sFile.duration = ~~(this.currPlayingFile.getDuration());  // make it an integer
        sFile.duration = (this.currPlayingFile.getDuration());  // make it an integer
        // self.durationString = self.fmtMSS(self.duration);   // replaced by the Angular DatePipe
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
  getProgressVal(e, f) {
    console.log('GetProgress value',parseFloat((e / f).toFixed(3)))
    return parseFloat((e / f).toFixed(3));
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
         
        }
      });
    }, 100);
  }

  setPlayingDefault() {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.serverFileArray.length; i++) {
      this.serverFileArray[i].isInPlay = false;
      this.serverFileArray[i].isPlaying = false;
      this.serverFileArray[i].duration = -1;
      this.serverFileArray[i].position = 0;
    }
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


  cancelDownload(){
    try {
      const fileTransfer: FileTransferObject = this.transfer.create();
      fileTransfer.abort();
    } catch (e) {}
  }
  onPlay(sf, i) {
    this.cancelAllAndPlayOne(sf, i, true)
    // if (!sf.isPlaying) {
    //   this.cancelAllAndPlayOne(sf, i, true)
    // } else {
    //   this.stopPlayRecording();
    // }
  }

  cancelAllAndPlayOne(sf, i, dd){
    this.cancelDownload();
    try {
      this.currPlayingFile.stop();
      this.currPlayingFile.release();
    } catch (e) {}
    this.download(sf, i, dd)
  }
}
