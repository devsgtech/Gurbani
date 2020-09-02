import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Platform , IonInfiniteScroll, ModalController} from '@ionic/angular';
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
import { downloadData } from '../../services/downloadData';
import { FilterModalComponentComponent } from 'src/app/Modal/filter-modal-component/filter-modal-component.component';
import { raagDB } from 'src/app/services/raagDb';
// import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  @Input()  isfav: any;
  @Input()  filterData: any;
  @Input()  searchString:any;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  searchOpt = '';
  storageDirectory: any; currPlayingFile: MediaObject;
  getDurationInterval: any;
  getPositionInterval: any;
  serverFileArray:  any = [];
  isPlayingAll = false;
  serverFileArrayCopy: any = [];
  testnextFileIndex= 0;
  offset = 0;
  // searchString = '';
  indexx: any;
  searchOffset = 0;
  online :boolean = true;
  backdrop : boolean = false;
  raagData  : any = [];
  checkDidFilter : boolean = false;
  sqlText:any;
  arrayText = [];
  cancelAll:boolean = true;
  totalFavourite = 0;
  noRecords :boolean = false;

  constructor(public platform: Platform,
    private file: File,
    private transfer: FileTransfer,
    private igdb: shabadDB,
    public changeui: ChangeUIService,
    private newHelper: newhelper,
    private androidPermissions: AndroidPermissions,
    private storage: Storage,
    private network: Network,
    private downloadData : downloadData,
    private raagDb  : raagDB,
    public modalController: ModalController,
    // private helper : HelperService,
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
    this.raagDb.dbState().subscribe((res) => {
      if(res){
        this.raagDb.fetchSongs().subscribe(item => {
          this.raagData = item;
        })
      }
    });
    if(this.isfav == true){
      
    }else{
      console.log('Fetch data From DB Search tab');
      this.fetchSql();
    }
    this.prepareAudioFile();
  }
  ionViewWillLeave() {
    this.testnextFileIndex = 0;
    this.newallStop();
  }

  setIndexZero(){
    this.testnextFileIndex = 0;
  }
  ionViewWillEnter() {
    if(this.isfav == true){
      this.getDataFromLocalStorage()
    }
    this.testnextFileIndex = 0;
    // this.getData();
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
    for (let i = 0; i < this.serverFileArray.length; i++) {
      this.serverFileArray[i].isInPlay = false;
      this.serverFileArray[i].isPlaying = false;
      this.serverFileArray[i].duration = -1;
      this.serverFileArray[i].position = 0;
    }
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
          this.testnextFileIndex = index + 1
          const nextFileIndex = this.testnextFileIndex;
          if (this.serverFileArray.length > nextFileIndex && !isSingle) {
            const nextFile = this.serverFileArray[nextFileIndex];
            this.download( nextFile, nextFileIndex, isSingle)
          }
        }
      });
    }, 100);
  }
  playRecording(sFile = null, index = 0, isSingle = false, newUrl = null) {
    ListComponent.scrollTo(index);
    if (sFile && !sFile.isFileDownloaded) {
      console.log('sFile', sFile.isDownloading, sFile, newUrl);
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
newplayAll : boolean = false;
playAll(){
  this.newplayAll = true;
  this.cancelAll = false;
  // this.testnextFileIndex = 0;
  // this.playRecording();
  this.download( null, this.testnextFileIndex,false)
}
newallStop(){
  this.newplayAll =  false;
  this.stopPlayRecording()
}
  stopPlayRecording() {
    if(this.isPlayingAll) {
      // this.testnextFileIndex = 0;
    }
    this.isPlayingAll = false;
    try {
      this.currPlayingFile.stop();
      this.currPlayingFile.release();
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

  getProgressVal(e, f ,sf) {
    return parseFloat((e / f).toFixed(3));
  }
/////////////////DB Search///////////////////////

searchWord(ev = null) {
  console.log(this.searchOpt, 'this.searchOpt');
  this.searchOffset = 0;
  // this.searchString = ev.target.value.trim();
  switch (this.searchOpt) {
    case '1':
      this.firstWordSearch(this.searchString);
      break;
    case '2':   // 2: playing
      this.searchAnywhere(this.searchString);
      break;
    case '3':   // 3: pause

      break;
    case '4':   // 4: stop

      break;
    default:
      this.searchAnywhere(this.searchString);
      break;
  }

}
/////////////////DB Search End///////////////////
/////////////////LOAD DATA From DB///////////////////////////
fetchSql() {
  this.storage.get('_Loaded_Db_INTO_DEVICE').then((loaded: any) => {
    console.log( 'Storage Data',loaded)
    if(loaded){
      this.getData()
    } else{
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
          if(this.igdb.rowCount > 60000){
          console.log('this.igdb.rowCount0 if', this.igdb.rowCount)
    
            this.getData()
          } else{
          console.log('this.igdb.rowCount0 else', this.igdb.rowCount)
            this.igdb.createTable().then((res) => {
              console.log('Response after Get Data From DB', res)
              res.map(item=>{
                item.duration= -1;
                item.position=0,
                item.isFileDownloaded= false,
                item.isDownloading= false,
                this.serverFileArray.push(item);
              })
              this.serverFileArrayCopy = this.serverFileArray;
              this.storage.set('_Loaded_Db_INTO_DEVICE',true)
              this.newHelper.dismissLoading();
              this.setFavourite();
            })
          }
        }, 8000);
    }
  }).catch(e => console.log("Error =>" ,e));
    
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
  // this.searchString = ev.target.value.trim();
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
    res.map(item=>{
      item.duration= -1;
      item.position=0,
      item.isFileDownloaded= false,
      item.isDownloading= false,
      this.serverFileArray.push(item);
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
    res.map(item=>{
      item.duration= -1;
      item.position=0,
      item.isFileDownloaded= false,
      item.isDownloading= false,
      this.serverFileArray.push(item);
    })
    this.serverFileArrayCopy = this.serverFileArray;
    event.target.complete();
  })
  this.setFavourite();
}
////////////////LOAD DATA FROM DB END//////////////////////
cancelAllAndPlayOne(sf, i, dd){
  this.cancelDownload();
  this.testnextFileIndex = 0;
  this.cancelAll = true;
  this.newplayAll = false;
  try {
    this.currPlayingFile.stop();
    this.currPlayingFile.release();
  } catch (e) {}
  this.download(sf, i, dd)
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
  console.log('check', this.cancelAll,'this.cancelAll  ',sf,'sf'  ,dd,' dd')
  let checkFileUrl = this.storageDirectory + '/'+ VARS.shabadDirectory + '/' + VARS.angDir + sf.ang_id + '/';
  let FileName = 'shabad_' + sf._id + '.mp3';
  this.file.checkFile(checkFileUrl, FileName).then((entry) => {
    let nurl = this.storageDirectory + '/' + VARS.shabadDirectory+ '/' + VARS.angDir + sf.ang_id + '/shabad_' + sf._id + '.mp3';
    sf.isDownloading = false;
   
    if(this.cancelAll == false && dd == false){
      console.log('onecancelAll', this.cancelAll,'this.cancelAll  ',sf,'sf' )
      setTimeout(() => {
        this.playRecording(sf, i, dd,nurl)
      }, 500);
    } 
   if(this.cancelAll && dd == true){
    setTimeout(() => {
      this.playRecording(sf, i, dd,nurl)
    }, 500);
   }

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
        
        console.log('Inside Download For Play', this.cancelAll,'this.cancelAll  ',sf,'sf' )
        if(this.cancelAll == false && dd == false){
          console.log('TwocancelAll', this.cancelAll,'this.cancelAll  ',sf,'sf' )
          setTimeout(() => {
            this.playRecording(sf, i, dd,nurl)
          }, 500);
        } 
       if(this.cancelAll && dd == true){
        setTimeout(() => {
          this.playRecording(sf, i, dd,nurl)
        }, 500);
       }
       

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
  this.serverFileArray.map(sa=>{
    sa.isFavourite = false;
  })
  console.log('Set Favourite function call')
  this.storage.get('_SGTECH_GURBANI_FAV').then((sdata: any) => {
    if(sdata){
      sdata.map(i=>{
       this.serverFileArray.map(li=>{
         if(li._id == i._id){
           li.isFavourite = true;
           console.log(li, 'Li inside Set fav')
         } 
       })
      })

     
    } 
    if(!sdata || sdata.length == 0 ){
      this.serverFileArray.map(li=>{
          li.isFavourite = false;
      })
    }
   }).catch(e => console.log(e));
}
  saveLocalFav(sf) {
    sf.isFavourite = !(sf?.isFavourite);

    if(sf.isFavourite){
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
      if(sf.isFavourite){
        this.newHelper.presentToastWithOptions('Saved Successfully')
      }
    } else {
      this.storage.get('_SGTECH_GURBANI_FAV').then((sdata: any) => {
        sdata.map((item,index)=>{
          if(item._id == sf._id){
            sdata.splice(index, 1);
          }
        })
        this.storage.set('_SGTECH_GURBANI_FAV', sdata);
      }).catch(e => console.log(e));
        this.newHelper.presentToastWithOptions('Removed Item Successfully')
    }
    
  }
///////////////Set Favourite Section End////////////////


/////////////////Get Data From Local Sorage for Favourite Start//////////////////

getDataFromLocalStorage() {
  this.serverFileArray = [];
    this.storage.get('_SGTECH_GURBANI_FAV').then((sdata: any) => {
      console.log( 'Storage Data',sdata)
      if(sdata){
        sdata.map(i=>{
          this.serverFileArray.push(i)
        })
        console.log( 'serverFileArray',this.serverFileArray)
        this.totalFavourite = sdata.length;
      }
    }).catch(e => console.log("Error =>" ,e));
}


removaFavourite(i) {
  console.log('i',i)
  this.storage.get('_SGTECH_GURBANI_FAV').then((sdata: any) => {
  console.log('sdata',sdata[i])
   sdata.splice(i, 1);
    this.serverFileArray = sdata;
    this.storage.set('_SGTECH_GURBANI_FAV', sdata);
    this.totalFavourite = sdata.length;
  }).catch(e => console.log(e));
    this.newHelper.presentToastWithOptions('Removed Item Successfully')
}
/////////////////Get Data From Local Sorage for Favourite End//////////////////

// Filter Modal//////////
async filterModal(){
  this.backdrop = true;
    const modal = await this.modalController.create({
      showBackdrop: true,
      component: FilterModalComponentComponent,
      cssClass: 'filter-modal',
      componentProps: { raagData: this.raagData }
    });
    modal.onDidDismiss()
    .then((data) => {
      this.backdrop = false;
      console.log('Close Modal Data', data.data);
      // this.searchFilterData(data.data)
  });

    return await modal.present();
}

checkFilterOrNot(event){
  if(this.checkDidFilter == true){
    this.loadMorewhenFilter(event);
    event.target.complete();
  } else {
    this.loadData(event)
  }
}
loadMorewhenFilter(event){
  let length  = this.arrayText.length;
  let offset  = this.arrayText[length - 1];
  offset      = offset + 10 ;
  this.arrayText[length - 1] = offset;
  this.searchFilterDataNotReset(this.sqlText,this.arrayText);
}

searchFilterData(sqlText,arrayText){
  this.serverFileArray = [];
  this.searchFilterDataNotReset(sqlText,arrayText);
}
searchFilterDataNotReset(sqlText,arrayText,){
  this.stopPlayRecording()
  this.noRecords = false;
  this.sqlText = sqlText;
  this.arrayText = arrayText;
  this.checkDidFilter = true;
  this.igdb.commonFilter(sqlText,arrayText).then((res) => {
    console.log('Response From Common Filter', res);
    res.map(item=>{
      item.duration= -1;
      item.position=0;
      item.isFileDownloaded= false;
      item.isDownloading= false;
      this.serverFileArray.push(item);
    })
    this.serverFileArrayCopy = this.serverFileArray;
    if (this.serverFileArray.length == 0){
      this.noRecords = true;
    }
    this.setFavourite();
    this.prepareAudioFile();
  })

  this.prepareAudioFile();
}

cancelDownload(){
  try {
    const fileTransfer: FileTransferObject = this.transfer.create();
    fileTransfer.abort();
  } catch (e) {}
}
onPlay(sf, i) {
  if (!sf.isPlaying) {
    this.cancelAllAndPlayOne(sf, i, true)
  } else {
    this.stopPlayRecording();
  }
}
}
