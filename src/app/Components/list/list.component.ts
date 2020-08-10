import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Platform , IonInfiniteScroll} from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { shabadDB } from 'src/app/services/shabadDB';
import { newhelper } from 'src/app/services/newhelper';
import {Storage} from '@ionic/storage';
import { ChangeUIService } from 'src/app/services/change-ui.service';
import { VARS } from 'src/app/services/constantString';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Network } from '@ionic-native/network/ngx';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  @Input() isfav: any;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  searchOpt: any;
  storageDirectory: any; currPlayingFile: MediaObject;
  getDurationInterval: any;
  getPositionInterval: any;
  serverFileArray:  any = [];
  isPlayingAll = false;
  serverFileArrayCopy: any = [];
  testnextFileIndex: any;
  offset = 0;
  searchString = '';
  indexx: any;
  searchOffset = 0;
  online :boolean = true;
  constructor(public platform: Platform,
    private file: File,
    private transfer: FileTransfer,
    private igdb: shabadDB,
    public changeui: ChangeUIService,
    private newHelper: newhelper,
    private androidPermissions: AndroidPermissions,
    private storage: Storage,
    private network: Network,
    private media: Media) {
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
    if(this.isfav == true){
      console.log('Favourite Tab')
    }else{
      console.log('Fetch data From DB Search tab');
      this.fetchSql();
    }
    
    // this.serverFileArray = [
    //   { duration: -1, position: 0, isFileDownloaded: false, isDownloading: false, fileName: '1.mp3', url: 'https://orientaloutsourcing.com/gurbani_app_audio/ang_1/1.mp3', title3: 'One Universal Creator God, TheName Is Truth  Creative Being Personified No Fear No Hatred Image Of The Undying, Beyond Birth, Self-Existent. By Guru\'s Grace~', title2: 'Ikoankaar Sathnaam Karathaa Purakh Nirabho Niravair Akaal Moorath Ajoonee Saibhan Gurprasaadh||', title1: 'ੴ ਸਤਿਨਾਮੁ ਕਰਤਾ ਪੁਰਖੁ ਨਿਰਭਉ ਨਿਰਵੈਰੁ ਅਕਾਲ ਮੂਰਤਿ ਅਜੂਨੀ ਸੈਭੰ ਗੁਰਪ੍ਰਸਾਦਿ ॥', },
    //   { duration: -1, position: 0, isFileDownloaded: false, isDownloading: false, fileName: '2.mp3', url: 'https://orientaloutsourcing.com/gurbani_app_audio/ang_1/2.mp3', title3: 'Chant And Meditate:', title2: '|| Jap ||', title1: '॥ ਜਪੁ ॥', },
    //   { duration: -1, position: 0, isFileDownloaded: false, isDownloading: false, fileName: '3.mp3', url: 'https://orientaloutsourcing.com/gurbani_app_audio/ang_1/3.mp3', title3: 'True In The Primal Beginning. True Throughout The Ages.', title2: 'Aadh Sach Jugaadh Sach ||', title1: 'ਆਦਿ ਸਚੁ ਜੁਗਾਦਿ ਸਚੁ ॥', },
    //   { duration: -1, position: 0, isFileDownloaded: false, isDownloading: false, fileName: '4.mp3', url: 'https://orientaloutsourcing.com/gurbani_app_audio/ang_1/4.mp3', title3: 'True Here And Now. O Nanak, Forever And Ever True. ||1||', title2: 'Hai Bhee Sach Naanak Hosee Bhee Sach ||1||', title1: 'ਹੈ ਭੀ ਸਚੁ ਨਾਨਕ ਹੋਸੀ ਭੀ ਸਚੁ ॥1॥', },
    //   { duration: -1, position: 0, isFileDownloaded: false, isDownloading: false, fileName: '5.mp3', url: 'https://orientaloutsourcing.com/gurbani_app_audio/ang_1/5.mp3', title3: 'By thinking, He cannot be reduced to thought, even by thinking hundreds of thousands of times.', title2: 'Sochai Soch N Hovee Jae Sochee Lakh Vaar ||', title1: 'ਸੋਚੈ ਸੋਚਿ ਨ ਹੋਵਈ ਜੇ ਸੋਚੀ ਲਖ ਵਾਰ ॥', },
    //   { duration: -1, position: 0, isFileDownloaded: false, isDownloading: false, fileName: '6.mp3', url: 'https://orientaloutsourcing.com/gurbani_app_audio/ang_1/6.mp3', title3: 'By remaining silent, inner silence is not obtained, even by remaining lovingly absorbed deep within.', title2: 'Chupai Chup N Hovee Jae Laae Rehaa Liv Thaar ||', title1: 'ਚੁਪੈ ਚੁਪਿ ਨ ਹੋਵਈ ਜੇ ਲਾਇ ਰਹਾ ਲਿਵ ਤਾਰ ॥', },
    //   { duration: -1, position: 0, isFileDownloaded: false, isDownloading: false, fileName: '7.mp3', url: 'https://orientaloutsourcing.com/gurbani_app_audio/ang_1/7.mp3', title3: 'The hunger of the hungry is not appeased, even by piling up loads of worldly goods.', title2: 'Bhukhiaa Bhukh N Outharee Jae Bannaa Pureeaa Bhaar ||', title1: 'ਭੁਖਿਆ ਭੁਖ ਨ ਉਤਰੀ ਜੇ ਬੰਨਾ ਪੁਰੀਆ ਭਾਰ ॥', },
    //   { duration: -1, position: 0, isFileDownloaded: false, isDownloading: false, fileName: '8.mp3', url: 'https://orientaloutsourcing.com/gurbani_app_audio/ang_1/8.mp3', title3: 'Hundreds of thousands of clever tricks, but not even one of them will go along with you in the end.', title2: 'Sehas Siaanapaa Lakh Hohi Th Eik N Chalai Naal ||', title1: 'ਸਹਸ ਸਿਆਣਪਾ ਲਖ ਹੋਹਿ ਤ ਇਕ ਨ ਚਲੈ ਨਾਲਿ ॥', },
    //   { duration: -1, position: 0, isFileDownloaded: false, isDownloading: false, fileName: '9.mp3', url: 'https://orientaloutsourcing.com/gurbani_app_audio/ang_1/9.mp3', title3: 'So how can you become truthful? And how can the veil of illusion be torn away?', title2: 'Kiv Sachiaaraa Hoeeai Kiv Koorrai Thuttai Paal ||', title1: 'ਕਿਵ ਸਚਿਆਰਾ ਹੋਈਐ ਕਿਵ ਕੂੜੈ ਤੁਟੈ ਪਾਲਿ ॥', },
    //   { duration: -1, position: 0, isFileDownloaded: false, isDownloading: false, fileName: '10.mp3', url: 'https://orientaloutsourcing.com/gurbani_app_audio/ang_1/10.mp3', title3: 'O Nanak, it is written that you shall obey the Hukam of His Command, and walk in the Way of His Will. ||1||', title2: 'Hukam Rajaaee Chalanaa Naanak Likhiaa Naal ||1||', title1: 'ਹੁਕਮਿ ਰਜਾਈ ਚਲਣਾ ਨਾਨਕ ਲਿਿਖਆ ਨਾਲਿ ॥1॥', }
    // ];
    this.prepareAudioFile();
  }
  ionViewWillLeave() {
    this.stopPlayRecording();
  }

  
  ionViewWillEnter() {
    this.testnextFileIndex = 0;
    // this.getData();
    console.log("ion Enter")
   this.setFavourite();
    this.online = (this.network.type !== this.network.Connection.NONE);
    this.network.onChange().subscribe((ev) => {
      this.online = (ev.type === 'online');
    });
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
  createAudioFile(url): MediaObject {
    return this.media.create(url);
    // if (this.platform.is('ios')) {
    //   return this.media.create((pathToDirectory).replace(/^file:\/\//, '') + '/' + filename);
    // } else {
    //   return this.media.create(pathToDirectory + filename);
    // }
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
        default:
          sFile.isInPlay = false;
          sFile.isPlaying = false;
          break;
      }
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
          this.testnextFileIndex = index + 1
          // const nextFileIndex = (index + 1);
          const nextFileIndex = this.testnextFileIndex;
          if (this.serverFileArray.length > nextFileIndex && !isSingle) {
            const nextFile = this.serverFileArray[nextFileIndex];
            this.download( nextFile, nextFileIndex, isSingle)
            // this.playRecording(nextFile, nextFileIndex, isSingle);
          }
        }
        console.log('position', position, sFile.duration);
      });
    }, 100);
  }
  playRecording(sFile = null, index = 0, isSingle = false, newUrl = null) {
    ListComponent.scrollTo(index);
    if (sFile && !sFile.isFileDownloaded) {
      // sFile.isDownloading = true;
      console.log('sFile', sFile.isDownloading, sFile);
      // this.prepareAudioFile([sFile]);
    }
    if (this.currPlayingFile) {
      this.stopPlayRecording();
    }
    let currentPlayFile: any;
    if (sFile) {
      currentPlayFile = sFile;
    } else {
      currentPlayFile = this.serverFileArray[0];
    }
    if (!isSingle) {
      this.isPlayingAll = true;
    }
    this.currPlayingFile = this.createAudioFile(newUrl)
    // this.currPlayingFile = this.createAudioFile(this.storageDirectory, currentPlayFile.fileName);
    this.currPlayingFile.play();
    this.setDuration(currentPlayFile);
    this.setStatus(currentPlayFile);
    this.getAndSetCurrentAudioPosition(currentPlayFile, index, isSingle);
  }


  nextplay() {
    this.testnextFileIndex = this.testnextFileIndex + 1;
    const nextFileIndex = this.testnextFileIndex;
    const nextFile = this.serverFileArray[nextFileIndex];
    let isSingle = false;
  this.download( nextFile, nextFileIndex, isSingle)
    // this.playRecording(nextFile, nextFileIndex, isSingle);
  }

  prevplay() {
    this.testnextFileIndex = this.testnextFileIndex - 1;
    const nextFileIndex = this.testnextFileIndex;
    const nextFile = this.serverFileArray[nextFileIndex];
    let isSingle = false;
  this.download( nextFile, nextFileIndex, isSingle)

    // this.playRecording(nextFile, nextFileIndex, isSingle);
  }

playAll(){
  this.testnextFileIndex = 0;
  // this.playRecording();
  this.download( null, 0,false)
}

  stopPlayRecording() {
    this.isPlayingAll = false;
    if(this.isPlayingAll) {
      this.testnextFileIndex = 0;
    }
    this.currPlayingFile.stop();
    this.currPlayingFile.release();
    clearInterval(this.getDurationInterval);
    clearInterval(this.getPositionInterval);
    this.setPlayingDefault();
  }

  pausePlayRecording(sFile) {
    sFile.isPlaying = false;
    this.currPlayingFile.pause();
    this.currPlayingFile.getDuration();
  }

  getProgressVal(e, f) {
    console.log('progress Value', (e / f).toFixed(3))
    return (e / f).toFixed(3);
  }
/////////////////LOAD DATA From DB///////////////////////////
fetchSql() {
  this.newHelper.presentLoadingWithOptions('Hold on, preparing your data. This may take some time!');
  this.igdb.dbState().subscribe((res) => {
    if (res) {
      this.igdb.fetchSongs().subscribe(item => {
        this.serverFileArray = item;
        this.serverFileArrayCopy = this.serverFileArray;
        this.newHelper.dismissLoading();
      })
    }
  });

    setTimeout(() => {
      console.log('this.igdb.rowCount0', this.igdb.rowCount)
      if(this.igdb.rowCount > 95000){
      console.log('this.igdb.rowCount0 if', this.igdb.rowCount)

        this.getData()
      } else{
      console.log('this.igdb.rowCount0 else', this.igdb.rowCount)
        this.igdb.createTable().then((res) => {
          console.log('Response after Get Data From DB', res)
          res.map(item => {
            this.serverFileArray.push(item)
          })
          this.serverFileArrayCopy = this.serverFileArray;
          this.newHelper.dismissLoading();
        })
      }
    }, 8000);
    
}

getData() {
  console.log('Call Get Function')
  this.serverFileArray = [];
  this.offset = 0;
  this.igdb.getDataOffset(this.offset).then((res) => {
    console.log('Response after Get Data From DB', res)
    res.map(item => {
      item.duration= -1;
      item.position=0,
      item.isFileDownloaded= false,
      item.isDownloading= false,
      this.serverFileArray.push(item)
    })
    this.serverFileArrayCopy = this.serverFileArray;
    this.newHelper.dismissLoading();
  })
  this.prepareAudioFile();
  this.setFavourite();
}

searchAnywhere(ev) {
  this.stopPlayRecording();
  this.infiniteScroll.disabled = false;
  this.searchOffset = 0;
  this.searchString = ev.target.value.trim();
  this.igdb.searchShabadAnyWhere(this.searchString).then((res) => {
    console.log('Resopnse GetData0', res);
    this.serverFileArray = res;
    this.serverFileArrayCopy = this.serverFileArray;
  })
  this.setFavourite();

}

firstWordSearch(ev) {
  this.stopPlayRecording();
  this.infiniteScroll.disabled = false;
  this.searchOffset = 0;
  this.searchString = ev.target.value.trim();
  this.igdb.searchShabadFirstWord(this.searchString).then((res) => {
    console.log('Resopnse GetData0', res);
    this.serverFileArray = res;
    this.serverFileArrayCopy = this.serverFileArray;
  })
  this.setFavourite();

}


loadData(event) {
  if (this.searchString !== '' || this.searchOpt !== '1') {
    this.searchShabadAnyWhereLoadMoreandOffset(event)
  } else if (this.searchOpt == '1') {
    this.searchShabadFirstWordLoadMoreandOffset(event)
  } else {
    this.offset = this.offset + 10;
    console.log('Done');
    this.igdb.getDataOffset(this.offset).then((res) => {
      console.log('Resopnse GetData0', res);
      if (res && res.length == 0) {
        event.target.disabled = true;
      }
      res.map(item => {
        this.serverFileArray.push(item)
      })
      this.serverFileArrayCopy = this.serverFileArray;
      event.target.complete();
    })
  }
  this.setFavourite();
}

searchShabadAnyWhereLoadMoreandOffset(event) {
  this.searchOffset = this.searchOffset + 10;
  let data = {
    offset: this.searchOffset,
    searchString: this.searchString,
  }
  console.log('data', data, this.searchOffset);
  this.igdb.searchShabadAnyWhereLoadMoreandOffset(data).then((res) => {
    console.log('Resopnse GetData0', res);
    if (res && res.length == 0) {
      event.target.disabled = true;
    }
    res.map(item => {
      this.serverFileArray.push(item)
    })
    this.serverFileArrayCopy = this.serverFileArray;
    event.target.complete();
  })
  this.setFavourite();

}

searchShabadFirstWordLoadMoreandOffset(event) {
  this.searchOffset = this.searchOffset + 10;
  let data = {
    offset: this.searchOffset,
    searchString: this.searchString,
  }
  this.igdb.searchShabadFirstWordLoadMoreandOffset(data).then((res) => {
    console.log('Resopnse GetData0', res);
    if (res && res.length == 0) {
      event.target.disabled = true;
    }
    res.map(item => {
      this.serverFileArray.push(item)
    })
    this.serverFileArrayCopy = this.serverFileArray;
    event.target.complete();
  })
  this.setFavourite();
}
////////////////LOAD DATA FROM DB END//////////////////////
async download(sf, i, dd) {
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
    // this.ply1(sf, i, dd, nurl);
    this.playRecording(sf, i, dd,nurl)

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
        this.playRecording(sf, i, dd,nurl);
        // this.ply1(sf, i, dd, nurl);
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

///////////////Set Favourite section Start///////////////////
setFavourite(){
  this.storage.get('_SGTECH_GURBANI_FAV').then((sdata: any) => {
    if(sdata){
      sdata.map(i=>{
       this.serverFileArray.map(li=>{
         if(li._id == i._id){
           li.isFavourite = true;
         } else{
           li.isFavourite = false;
         }
       })
      })
    } 
    if(sdata && sdata.length == 0 ){
      this.serverFileArray.map(li=>{
          li.isFavourite = false;
      })
    }
   }).catch(e => console.log(e));
}
  saveLocalFav(sf) {
    sf.isFavourite = !(sf?.isFavourite);
    this.storage.get('_SGTECH_GURBANI_FAV').then((sdata: any) => {
      if (!sdata){
        sdata = [];
      } 
      let availableBefore : any = false;
      sdata.map(i=>{
        if(i._id == sf._id){
          availableBefore = true;
        }
        console.log(i,'Storage')
      });

      console.log(availableBefore,'availableBefore')

      if(!availableBefore || availableBefore != true){
      console.log('Push Into SDATAfore')

        sdata.push(sf);
      }
      this.storage.set('_SGTECH_GURBANI_FAV', sdata);
    }).catch(e => console.log(e));
  }
///////////////Set Favourite Section End////////////////
}
