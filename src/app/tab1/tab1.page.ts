import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform, IonInfiniteScroll } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { MenuController } from '@ionic/angular';
import { ChangeUIService } from '../services/change-ui.service';
import { shabadDB } from '../services/shabadDB';
import { ActionSheetController } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
// import { DatabaseService } from '../database.service';
import { downloadData } from '../services/downloadData';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  driveAudio:any;
  searchOpt: any;
  storageDirectory: any; currPlayingFile: MediaObject;
  getDurationInterval: any;
  getPositionInterval: any;
  serverFileArray: any;
  serverFileArrayCopy: any;
  isPlayingAll = false;
  newtestFile:any;
  testnextFileIndex: any;
  stopall:boolean =false;
  listItemFromDb : any;
  listItemFromDbCopy : any;
  raagSelect = '';
  offset = 0;
  searchString = '';
  indexx :any;
  searchOffset = 0;
  constructor(public platform: Platform,
    private file: File,
    private igdb : shabadDB,
    private transfer: FileTransfer,
    private menu: MenuController,
    public changeui:ChangeUIService,
    public actionSheetController: ActionSheetController,
    private androidPermissions: AndroidPermissions,
    private downloadData : downloadData,
    private media: Media) {
    this.platform.ready().then(() => {
      if (this.platform.is('ios')) {
        this.storageDirectory = this.file.dataDirectory;
      } else if (this.platform.is('android')) {
        this.storageDirectory = this.file.externalDataDirectory;
      }
    });
    this.platform.pause.subscribe(e => {
      // this.stopPlayRecording();
    });
  }
  static scrollTo(index) {
    const currentId = document.getElementById('currentPlayItemId' + index);
    currentId.scrollIntoView({ behavior: 'smooth' });
  }
  ngOnInit() {
    this.fetchSql()
    this.serverFileArray = [
      { duration: -1, position: 0, isFileDownloaded: false, isDownloading: false, fileName: '1.mp3', url: 'https://orientaloutsourcing.com/gurbani_app_audio/ang_1/1.mp3', title3: 'One Universal Creator God, TheName Is Truth  Creative Being Personified No Fear No Hatred Image Of The Undying, Beyond Birth, Self-Existent. By Guru\'s Grace~', title2: 'Ikoankaar Sathnaam Karathaa Purakh Nirabho Niravair Akaal Moorath Ajoonee Saibhan Gurprasaadh||', title1: 'ੴ ਸਤਿਨਾਮੁ ਕਰਤਾ ਪੁਰਖੁ ਨਿਰਭਉ ਨਿਰਵੈਰੁ ਅਕਾਲ ਮੂਰਤਿ ਅਜੂਨੀ ਸੈਭੰ ਗੁਰਪ੍ਰਸਾਦਿ ॥', },
      { duration: -1, position: 0, isFileDownloaded: false, isDownloading: false, fileName: '2.mp3', url: 'https://orientaloutsourcing.com/gurbani_app_audio/ang_1/2.mp3', title3: 'Chant And Meditate:', title2: '|| Jap ||', title1: '॥ ਜਪੁ ॥', },
      { duration: -1, position: 0, isFileDownloaded: false, isDownloading: false, fileName: '3.mp3', url: 'https://orientaloutsourcing.com/gurbani_app_audio/ang_1/3.mp3', title3: 'True In The Primal Beginning. True Throughout The Ages.', title2: 'Aadh Sach Jugaadh Sach ||', title1: 'ਆਦਿ ਸਚੁ ਜੁਗਾਦਿ ਸਚੁ ॥', },
      { duration: -1, position: 0, isFileDownloaded: false, isDownloading: false, fileName: '4.mp3', url: 'https://orientaloutsourcing.com/gurbani_app_audio/ang_1/4.mp3', title3: 'True Here And Now. O Nanak, Forever And Ever True. ||1||', title2: 'Hai Bhee Sach Naanak Hosee Bhee Sach ||1||', title1: 'ਹੈ ਭੀ ਸਚੁ ਨਾਨਕ ਹੋਸੀ ਭੀ ਸਚੁ ॥1॥', },
      { duration: -1, position: 0, isFileDownloaded: false, isDownloading: false, fileName: '5.mp3', url: 'https://orientaloutsourcing.com/gurbani_app_audio/ang_1/5.mp3', title3: 'By thinking, He cannot be reduced to thought, even by thinking hundreds of thousands of times.', title2: 'Sochai Soch N Hovee Jae Sochee Lakh Vaar ||', title1: 'ਸੋਚੈ ਸੋਚਿ ਨ ਹੋਵਈ ਜੇ ਸੋਚੀ ਲਖ ਵਾਰ ॥', },
      { duration: -1, position: 0, isFileDownloaded: false, isDownloading: false, fileName: '6.mp3', url: 'https://orientaloutsourcing.com/gurbani_app_audio/ang_1/6.mp3', title3: 'By remaining silent, inner silence is not obtained, even by remaining lovingly absorbed deep within.', title2: 'Chupai Chup N Hovee Jae Laae Rehaa Liv Thaar ||', title1: 'ਚੁਪੈ ਚੁਪਿ ਨ ਹੋਵਈ ਜੇ ਲਾਇ ਰਹਾ ਲਿਵ ਤਾਰ ॥', },
      { duration: -1, position: 0, isFileDownloaded: false, isDownloading: false, fileName: '7.mp3', url: 'https://orientaloutsourcing.com/gurbani_app_audio/ang_1/7.mp3', title3: 'The hunger of the hungry is not appeased, even by piling up loads of worldly goods.', title2: 'Bhukhiaa Bhukh N Outharee Jae Bannaa Pureeaa Bhaar ||', title1: 'ਭੁਖਿਆ ਭੁਖ ਨ ਉਤਰੀ ਜੇ ਬੰਨਾ ਪੁਰੀਆ ਭਾਰ ॥', },
      { duration: -1, position: 0, isFileDownloaded: false, isDownloading: false, fileName: '8.mp3', url: 'https://orientaloutsourcing.com/gurbani_app_audio/ang_1/8.mp3', title3: 'Hundreds of thousands of clever tricks, but not even one of them will go along with you in the end.', title2: 'Sehas Siaanapaa Lakh Hohi Th Eik N Chalai Naal ||', title1: 'ਸਹਸ ਸਿਆਣਪਾ ਲਖ ਹੋਹਿ ਤ ਇਕ ਨ ਚਲੈ ਨਾਲਿ ॥', },
      { duration: -1, position: 0, isFileDownloaded: false, isDownloading: false, fileName: '9.mp3', url: 'https://orientaloutsourcing.com/gurbani_app_audio/ang_1/9.mp3', title3: 'So how can you become truthful? And how can the veil of illusion be torn away?', title2: 'Kiv Sachiaaraa Hoeeai Kiv Koorrai Thuttai Paal ||', title1: 'ਕਿਵ ਸਚਿਆਰਾ ਹੋਈਐ ਕਿਵ ਕੂੜੈ ਤੁਟੈ ਪਾਲਿ ॥', },
      { duration: -1, position: 0, isFileDownloaded: false, isDownloading: false, fileName: '10.mp3', url: 'https://orientaloutsourcing.com/gurbani_app_audio/ang_1/10.mp3', title3: 'O Nanak, it is written that you shall obey the Hukam of His Command, and walk in the Way of His Will. ||1||', title2: 'Hukam Rajaaee Chalanaa Naanak Likhiaa Naal ||1||', title1: 'ਹੁਕਮਿ ਰਜਾਈ ਚਲਣਾ ਨਾਨਕ ਲਿਿਖਆ ਨਾਲਿ ॥1॥', }
    ];
   this.serverFileArrayCopy = this.serverFileArray;
    // this.prepareAudioFile();
  }
  ionViewWillLeave() {
    // this.stopPlayRecording();
  }

  ionViewWillEnter() {
    this.testnextFileIndex = 0;
  }
 /* prepareAudioFile(singleFile = []) {
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
  createAudioFile(pathToDirectory, filename): MediaObject {
    return this.media.create(filename);
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
        } else { 
          this.stopPlayRecording();
          this.testnextFileIndex = index + 1
        
          const nextFileIndex = this.testnextFileIndex;
          if (this.serverFileArray.length > nextFileIndex && !isSingle) {
            const nextFile = this.serverFileArray[nextFileIndex];
            this.playRecording(nextFile, nextFileIndex, isSingle);
          }
        }
        console.log('position', position, sFile.duration);
      });
    }, 100);
  }
  playRecording(sFile = null, index = 0, isSingle = false) {
    Tab1Page.scrollTo(index);
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
    this.currPlayingFile = this.createAudioFile(this.storageDirectory, currentPlayFile.url);
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
    this.playRecording(nextFile, nextFileIndex, isSingle);
  }

  prevplay() {
    this.testnextFileIndex = this.testnextFileIndex - 1;
    const nextFileIndex = this.testnextFileIndex;
    const nextFile = this.serverFileArray[nextFileIndex];
    let isSingle = false;
    this.playRecording(nextFile, nextFileIndex, isSingle);
  }

playAll(){
  this.testnextFileIndex = 0;
  this.playRecording()
}

  stopPlayRecording() {
    this.isPlayingAll = false;
    if(this.isPlayingAll) {
      this.testnextFileIndex = 0;
    }
    if( this.currPlayingFile) {
      this.currPlayingFile.stop();
      this.currPlayingFile.release();
    }
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
    return (e / f).toFixed(3);
  }*/

  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }
////////////////////Functionality new/////////////////////////
  closeMenu() {
    this.menu.close();
  }

  nextplaynn() {
    this.stopAll();
  setTimeout(()=>{    
      this.indexx = this.indexx + 1;
      this.stopall = false;
      console.log(this.stopall,'this.stopall')

      this.plyAll1(null, this.indexx, false, this.indexx);

 }, 1000);
  }
  prevplaynn() {
    this.stopAll();
    console.log(this.stopall,'this.stopall')

    setTimeout(()=>{ 
      this.indexx = this.indexx - 1;
      this.stopall = false;
      console.log(this.stopall,'this.stopall')
      this.plyAll1(null, this.indexx, false, this.indexx);

 }, 1000);
    
  }
newPlay(sFile = null, index = 0, isSingle = false, i=0){
  this.indexx = index;
  console.log('inside')

  Tab1Page.scrollTo(index);
    if (sFile && !sFile.isFileDownloaded) {
      // sFile.isDownloading = true;
      console.log('sFile', sFile.isDownloading, sFile);
      // this.prepareAudioFile([sFile]);
    }
    if (this.newtestFile) {
      this.stopSingleFile();
    }
    let currentPlayFile: any;
    if (sFile) {
      currentPlayFile = sFile;
      this.serverFileArray[index].isPlaying = true;
    } else {
      this.serverFileArray[index].isPlaying = true;
      currentPlayFile = this.serverFileArray[index];
    }
    if (!isSingle) {
      this.isPlayingAll = true;
    }
    const file: MediaObject =this.media.create(currentPlayFile.url);
    this.newtestFile = file;
    this.newtestFile.play();
    this.newtestFile.onSuccess.subscribe(() => {
      this.serverFileArray[index].isPlaying = false;
      if(sFile){
        this.stopSingleFile();
        sFile.isPlaying = false
      }
      if ((i + 1) == this.serverFileArray.length) {
        // do nothing
        console.log('inside if section')
       } else {
         if(isSingle == false){
          this.plyAll(sFile = null, index = index + 1 , isSingle = false,i + 1 )
         }
       } 
    })
}

plyAll(sFile = null,index = 0,isSingle = false, i){
    Tab1Page.scrollTo(index);
    if(!this.stopall || sFile){
      console.log('inside section')
      if(isSingle){
        this.stopAll()
        this.isPlayingAll = false;
      }
      this.newPlay(sFile, index, isSingle,i)
    }
  }
  plyAll1(sFile = null,index = 0,isSingle = false, i){
    this.stopall = false;
    this.plyAll(sFile, index, isSingle,i)
  }

  stopSingleFile(){
    if(this.stopall == false){
      this.newtestFile.pause()
    } else {
      if (this.newtestFile) {
        this.newtestFile.stop();
        this.newtestFile.release();
      }
    }
    console.log('Stop Single File section');
  }

  stopAll(){
    if (this.newtestFile) {
      this.newtestFile.stop();
      this.newtestFile.release();
    }
    this.isPlayingAll = false;
    this.stopall = true;
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.raagSelect = 'raag1' ;
          console.log('Delete clicked');
        }
      }, {
        text: 'Share',
        icon: 'share',
        handler: () => {
          this.raagSelect = 'raag2' ;
          console.log('Share clicked');
        }
      }, {
        text: 'Play (open modal)',
        icon: 'caret-forward-circle',
        handler: () => {
          this.raagSelect = 'raag3' ;
          console.log('Play clicked');
        }
      }, {
        text: 'Favorite',
        icon: 'heart',
        handler: () => {
          this.raagSelect = 'raag4' ;
          console.log('Favorite clicked');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          this.raagSelect = this.raagSelect ;
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }
  
///////////////////DataBase fetch and search///////////////////////
  
  searchWord(ev=null){
    console.log(this.searchOpt, 'this.searchOpt');
    this.searchOffset = 0;
    this.searchString = ev.target.value.trim();
    switch (this.searchOpt) {
      case '1':
        this.firstWordSearch(ev);
        break;
      case '2':   // 2: playing
        this.searchAnywhere(ev);
        break;
      case '3':   // 3: pause
      
        break;
      case '4':   // 4: stop

        break;
      default:
        this.searchAnywhere(ev);
        break;
    }
  
  }

  fetchSql(){
    this.igdb.dbState().subscribe((res) => {
      console.log('res', res);
      if(res){
        this.igdb.fetchSongs().subscribe(item => {
         console.log('item', item);
          this.listItemFromDb = item;
          this.listItemFromDbCopy = this.listItemFromDb;
        })
      }
    });
    setTimeout(()=>{ 
     this.getData()
 }, 3000);
}

getData(){
  console.log('call get Data funct')
  this.listItemFromDb = [];
  this.offset = 0;
  this.igdb.getDataOffset(this.offset).then((res) => {
    res.map(item=>{
      this.listItemFromDb.push(item)
    })
    this.listItemFromDbCopy = this.listItemFromDb;
   })

}

searchAnywhere(ev){
  this.infiniteScroll.disabled = false;
  this.searchOffset = 0;
  this.searchString = ev.target.value.trim();
  this.igdb.searchShabadAnyWhere(this.searchString).then((res) => {
    console.log('Resopnse GetData0', res);
    this.listItemFromDb = res;
    this.listItemFromDbCopy = this.listItemFromDb;
   })
}

firstWordSearch(ev){
  this.infiniteScroll.disabled = false;
  this.searchOffset = 0;
  this.searchString = ev.target.value.trim();
  this.igdb.searchShabadFirstWord(this.searchString).then((res) => {
    console.log('Resopnse GetData0', res);
    this.listItemFromDb = res;
    this.listItemFromDbCopy = this.listItemFromDb;
   })
}


loadData(event){
     if(this.searchString !=='' || this.searchOpt !== '1'){
       this.searchShabadAnyWhereLoadMoreandOffset(event)
     } else if(this.searchOpt == '1'){
      this.searchShabadFirstWordLoadMoreandOffset(event)
     } else{
      this.offset = this.offset + 10;
      console.log('Done');
      this.igdb.getDataOffset(this.offset).then((res) => {
        console.log('Resopnse GetData0', res);
        if(res.length == 0){
          event.target.disabled = true;
        }
        res.map(item=>{
          this.listItemFromDb.push(item)
        })
        this.listItemFromDbCopy = this.listItemFromDb;
        event.target.complete();
       })
     }
}

searchShabadAnyWhereLoadMoreandOffset(event){
  this.searchOffset = this.searchOffset + 10;
  let data = {
    offset : this.searchOffset,
    searchString: this.searchString,
  }
  console.log('data', data, this.searchOffset);
  this.igdb.searchShabadAnyWhereLoadMoreandOffset(data).then((res) => {
    console.log('Resopnse GetData0', res);
    if(res.length == 0){
      event.target.disabled = true;
    }
    res.map(item=>{
      this.listItemFromDb.push(item)
    })
    this.listItemFromDbCopy = this.listItemFromDb;
    event.target.complete();
   })
}

searchShabadFirstWordLoadMoreandOffset(event){
  this.searchOffset = this.searchOffset + 10;
  let data = {
    offset : this.searchOffset,
    searchString: this.searchString,
  }
  this.igdb.searchShabadFirstWordLoadMoreandOffset(data).then((res) => {
    console.log('Resopnse GetData0', res);
    if(res.length == 0){
      event.target.disabled = true;
    }
    res.map(item=>{
      this.listItemFromDb.push(item)
    })
    this.listItemFromDbCopy = this.listItemFromDb;
    event.target.complete();
   })
}






//////////////DOWNLOAD AUDIO PLAY START///////////////////////
download(sf, i, dd) {
  this.stopPlaying();
  this.androidPermissions.hasPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
    .then(status => {
      if (status.hasPermission) {
        this.createShabad(sf, i, dd);
      }
      else {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
          .then(status => {
            if (status.hasPermission) {
              this.createShabad(sf, i, dd);
            }
          });
      }
    });
}

createShabad(sf, i, dd) {
  this.file.createDir(this.file.externalRootDirectory, 'shabad', false).then(response => {
    this.createAngDir(sf, i, dd);
  }).catch(err => {
    if (err.message == 'PATH_EXISTS_ERR') {
      this.createAngDir(sf, i, dd)
    }
  });
}

createAngDir(sf, i, dd) {
  let ang_id = 1;
  this.file.createDir(this.file.externalRootDirectory + 'shabad', 'ang_' + ang_id, false).then(response => {
    console.log('Ang Directory created', response);
    this.downloadAudioFile(sf, i, dd)
  }).catch(err => {
    console.log('Could not create directory "my_downloads" ', err);
    if (err.message == 'PATH_EXISTS_ERR') {
      this.downloadAudioFile(sf, i, dd)
    }
  });
}


downloadAudioFile(sf, i, dd) {
  let ang_id = 1;
  let shabad_id = i + 1;
  let url = 'https://firebasestorage.googleapis.com/v0/b/testgurubani.appspot.com/o/ang_' + ang_id + '%2Fshabad_' + shabad_id + '.mp3?alt=media&token=fcfe83f3-f21c-4d77-a4b8-438f0e53281a'
  let checkFileUrl = this.file.externalRootDirectory + '/shabad/' + 'ang_' + ang_id +'/'; 
  let FileName = 'shabad_' + shabad_id + '.mp3';
  
  this.file.checkFile(checkFileUrl, FileName).then((entry) => {
    let nurl = this.file.externalRootDirectory + '/shabad/' + 'ang_' + ang_id + '/shabad_' + shabad_id + '.mp3';
    sf.isDownloading = false;
    this.ply1(sf, i, dd, nurl);
  })
    .catch((err) => {
      sf.isDownloading = true;
      this.downloadData.newDownLoadAudioFile(url,ang_id,shabad_id).then(response => {
        this.ply1(sf, i, dd, response);
      }).catch(err => {
        console.log('downLodaData Common Error', err)
      });
    });
}

ply1(sf, i, dd, url) {
  sf.isPlaying = true;
  const file: MediaObject = this.media.create(url);
  this.driveAudio = file;
  this.driveAudio.play();
  this.driveAudio.onSuccess.subscribe(() => {
    sf.isPlaying = false;
  })
}
stopPlaying(){
  if(this.driveAudio){
    this.driveAudio.stop();
  }
}
///////////////DOWNLOAD AUDIO PLAY END///////////////////////
}
