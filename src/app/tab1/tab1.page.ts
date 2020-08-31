import {Component, OnInit, ViewChild} from '@angular/core';
import {ActionSheetController, IonInfiniteScroll, MenuController, Platform, ToastController} from '@ionic/angular';
import {File} from '@ionic-native/file/ngx';
import {FileTransfer, FileTransferObject} from '@ionic-native/file-transfer/ngx';
import {Media, MediaObject} from '@ionic-native/media/ngx';
import {ChangeUIService} from '../services/change-ui.service';
import {shabadDB} from '../services/shabadDB';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
// import { DatabaseService } from '../database.service';
import {downloadData} from '../services/downloadData';
import {Storage} from '@ionic/storage';
import {Network} from '@ionic-native/network/ngx';
import {newhelper} from '../services/newhelper';
import {VARS} from '../services/constantString';
import _ from 'lodash';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  
  driveAudio: any;
  searchOpt: any;
  storageDirectory: any; currPlayingFile: MediaObject;
  getDurationInterval: any;
  getPositionInterval: any;
  serverFileArray: any;
  serverFileArrayCopy: any;
  isPlayingAll = false;
  newtestFile: any;
  testnextFileIndex: any;
  stopall: boolean = false;
  listItemFromDb = [];
  listItemFromDbCopy=[];
  raagSelect = '';
  offset = 0;
  searchString = '';
  indexx: any;
  searchOffset = 0;
  online :boolean = true;
  disablePrev:boolean = true;
  disableNext:boolean = true;

  constructor(public platform: Platform,
    private file: File,
    private igdb: shabadDB,
    private transfer: FileTransfer,
    private menu: MenuController,
    public changeui: ChangeUIService,
    public actionSheetController: ActionSheetController,
    private androidPermissions: AndroidPermissions,
    private downloadData: downloadData,
    private newHelper: newhelper,
    public toastController: ToastController,
    private network: Network,
    private media: Media,
    private storage: Storage) {
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
    this.newHelper.presentLoadingWithOptions('Hold on, preparing your data. This may take some time!');
    this.fetchSql()
  }
  ionViewWillLeave() {
    this.stopAll()
  }
  ionViewWillEnter() {
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
 
  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }
  ////////////////////Functionality new/////////////////////////
  closeMenu() {
    this.menu.close();
  }
  nextplaynn() {
    console.log('next play click')
    this.stopAll();
    setTimeout(() => {
      this.indexx = this.indexx + 1;
      this.stopall = false;
      this.plyAll1(null, this.indexx, false, this.indexx);
    }, 100);

  }
  prevplaynn() {
    this.stopAll();
    setTimeout(() => {
      this.indexx = this.indexx - 1;
      this.stopall = false;
      console.log(this.stopall, 'this.stopall')
      this.plyAll1(null, this.indexx, false, this.indexx);
    }, 100);
  }
  newPlay(sFile = null, index = 0, isSingle = false, i = 0) {
    this.indexx = index;
    Tab1Page.scrollTo(index);
    if (!sFile) {
      sFile = this.listItemFromDb[i];
    }
    if (this.driveAudio) {
      this.stopSingleFile();
    }
    if (!isSingle) {
      this.isPlayingAll = true;
    }
    this.download(sFile, i, isSingle);
  }

  
  plyAll(sFile = null, index = 0, isSingle = false, i = 0) {
    Tab1Page.scrollTo(index);
    if (!this.stopall || sFile) {
      if (isSingle) {
        this.stopAll()
        this.isPlayingAll = false;
      }
      this.newPlay(sFile, index, isSingle, i)
    }
  }
  plyAll1(sFile = null, index = 0, isSingle = false, i = 0) {
    this.stopall = false;
    this.plyAll(sFile, index, isSingle, i)
  }

  stopSingleFile() {
    if (this.stopall == false) {
      this.driveAudio.pause()
    } else {
      if (this.driveAudio) {
        this.driveAudio.stop();
        this.driveAudio.release();
      }
    }
  }
 
  stopAll() {
    this.disablePrev = true;
    this.disableNext = true;
    if (this.driveAudio) {
      this.driveAudio.stop();
      this.driveAudio.release();
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
          this.raagSelect = 'raag1';
          console.log('Delete clicked');
        }
      }, {
        text: 'Share',
        icon: 'share',
        handler: () => {
          this.raagSelect = 'raag2';
          console.log('Share clicked');
        }
      }, {
        text: 'Play (open modal)',
        icon: 'caret-forward-circle',
        handler: () => {
          this.raagSelect = 'raag3';
          console.log('Play clicked');
        }
      }, {
        text: 'Favorite',
        icon: 'heart',
        handler: () => {
          this.raagSelect = 'raag4';
          console.log('Favorite clicked');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          // this.raagSelect = this.raagSelect;
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  
  ///////////////////DataBase fetch and search///////////////////////

  searchWord(ev = null) {
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

  fetchSql() {
    this.igdb.dbState().subscribe((res) => {
      if (res) {
        this.igdb.fetchSongs().subscribe(item => {
          this.listItemFromDb = item;
          this.listItemFromDbCopy = this.listItemFromDb;
          console.log('sggs_darpan', this.listItemFromDb);
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
              this.listItemFromDb.push(item)
            })
            this.listItemFromDbCopy = this.listItemFromDb;
            this.newHelper.dismissLoading();
          })
        }
      }, 8000);
      
  }

  getData() {
    console.log('Call Get Function')
    this.listItemFromDb = [];
    this.offset = 0;
    this.igdb.getDataOffset(this.offset).then((res) => {
      console.log('Response after Get Data From DB', res)
      res.map(item => {
        this.listItemFromDb.push(item)
      })
      this.listItemFromDbCopy = this.listItemFromDb;
      this.newHelper.dismissLoading();
    })
    this.setFavourite();
  }

  searchAnywhere(ev) {
    this.stopSingleFile()
    this.stopAll()
    this.infiniteScroll.disabled = false;
    this.searchOffset = 0;
    this.searchString = ev.target.value.trim();
    this.igdb.searchShabadAnyWhere(this.searchString).then((res) => {
      console.log('Resopnse GetData0', res);
      this.listItemFromDb = res;
      this.listItemFromDbCopy = this.listItemFromDb;
    })
    this.setFavourite();

  }

  firstWordSearch(ev) {
    this.stopSingleFile()
    this.stopAll()
    this.infiniteScroll.disabled = false;
    this.searchOffset = 0;
    this.searchString = ev.target.value.trim();
    this.igdb.searchShabadFirstWord(this.searchString).then((res) => {
      console.log('Resopnse GetData0', res);
      this.listItemFromDb = res;
      this.listItemFromDbCopy = this.listItemFromDb;
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
          this.listItemFromDb.push(item)
        })
        this.listItemFromDbCopy = this.listItemFromDb;
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
        this.listItemFromDb.push(item)
      })
      this.listItemFromDbCopy = this.listItemFromDb;
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
        this.listItemFromDb.push(item)
      })
      this.listItemFromDbCopy = this.listItemFromDb;
      event.target.complete();
    })
    this.setFavourite();
  }






  //////////////DOWNLOAD AUDIO PLAY START///////////////////////
  async download(sf, i, dd) {
    this.stopPlaying(sf);
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
      this.ply1(sf, i, dd, nurl);
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
          this.ply1(sf, i, dd, nurl);
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

  ply1(sf, i, dd, url) {
    console.log('url----',url)
    sf.isDownloading = false;
    /*_.forEach(this.listItemFromDb, (vv) => {
      vv.isPlaying = false;
    });*/
    sf.isPlaying = true;
    const murl = (this.platform.is('ios')) ? url.replace(/^file:\/\//, '') : url;
    this.driveAudio = this.media.create(murl);
    this.driveAudio.play();
    this.driveAudio.onSuccess.subscribe(() => {
      // sf.isPlaying = false;
      if (sf) {
        this.stopSingleFile();
        sf.isPlaying = false
      }
      if ((i + 1) == this.listItemFromDb.length) {
        console.log('inside if section')
      } else {
        sf.isPlaying = false
        if (dd == false) {
          this.plyAll(sf = null, i + 1, dd = false, i + 1)
        }
      }
    });
    this.driveAudio.onError.subscribe((e) => {
      console.log('eee', e);
    })
    this.driveAudio.onStatusUpdate.subscribe((status) => {
      console.log('media status', status);
    });

  }
  stopPlaying(sf) {
    sf? sf.isPlaying = false:null;
    if (this.driveAudio) {
      this.driveAudio.stop();
    }
  }

  
  ///////////////DOWNLOAD AUDIO PLAY END///////////////////////
setFavourite(){
  this.storage.get('_SGTECH_GURBANI_FAV').then((sdata: any) => {
    if(sdata){
      sdata.map(i=>{
       this.listItemFromDb.map(li=>{
         if(li._id == i._id){
           li.isFavourite = true;
         } else{
           li.isFavourite = false;
         }
       })
      })
    } 
    if(sdata && sdata.length == 0 ){
      this.listItemFromDb.map(li=>{
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

  getShabad(){
    console.log('Call Again get Function');
    this.getData()
  }
}
