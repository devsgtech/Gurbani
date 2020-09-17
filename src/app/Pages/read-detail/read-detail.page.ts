import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {ListComponent} from '../../Components/list/list.component';
import {raags, VARS, writes} from '../../services/constantString';
import {FileTransfer, FileTransferObject} from '@ionic-native/file-transfer/ngx';
import {AlertController, IonInfiniteScroll, Platform} from '@ionic/angular';
import {Media, MediaObject} from '@ionic-native/media/ngx';
import {ChangeUIService} from '../../services/change-ui.service';
import {shabadDB} from '../../services/shabadDB';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {File} from '@ionic-native/file/ngx';
import {newhelper} from '../../services/newhelper';
import {Network} from '@ionic-native/network/ngx';
import {HelperService} from '../../services/helper.service';

@Component({
  selector: 'app-read-detail',
  templateUrl: './read-detail.page.html',
  styleUrls: ['./read-detail.page.scss'],
})
export class ReadDetailPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  getPositionInterval: any;
  currPlayingFile: MediaObject;
  sqlText: any;
  arrayText = [];
  serverFileArray = [];
  serverFileArrayCopy = [];
  sqlScript = '';
  storageDirectory: any;
  online :boolean = true;
  getDurationInterval: any;
  sahibName= '';
  writerNames = writes.writerArray;
  raagJsonArray = raags.raagArray;
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
    private ngZone: NgZone,
    private helper: HelperService) {
    this.helper.navParams().then((params: any) => {
      this.readBook(params);
    }).catch(() => {});
    this.platform.ready().then(() => {
      if (this.platform.is('ios')) {
        this.storageDirectory = this.file.dataDirectory;
      } else if (this.platform.is('android')) {
        this.storageDirectory = this.file.externalDataDirectory;
      }
    });
    this.platform.pause.subscribe(e => {
      this.ngZone.run(() => {
        this.newallStop();
      });
    });
    this.platform.resume.subscribe(e => {
      this.ngZone.run(() => {
        this.newallStop();
      });
    });
  }
  ngOnInit() {
  }
  readBook(item) {
    // this.listShow = true;
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
    console.log('limit----', limit);
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
  searchFilterDataNotReset(sqlText, arrayText) {
    this.serverFileArrayCopy = [];
    this.serverFileArray = [];
    this.sqlText = sqlText;
    this.arrayText = arrayText;
    this.igdb.commonFilter(sqlText, arrayText).then((res) => {
      res.map(item => {
        item.duration= -1;
        item.position=0;
        item.isFileDownloaded= false;
        item.isDownloading= false;
        this.serverFileArrayCopy.push(item);
      });
      this.pushData();
    })
  }
  pushData() {
    for (let i = 0; i < 10; i++) {
      this.serverFileArray.push(this.serverFileArrayCopy[i])
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
  async checkNetwork() {
    await this.newHelper.presentToastWithOptions(this.online ? 'You are connected to internet, woohoo!' : 'You are not connected to internet!');
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
    this.scrollTo(index);
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
  nextplay(nextIndex = 1) {
    this.testnextFileIndex = this.testnextFileIndex + 1;
    const nextFileIndex = this.testnextFileIndex;
    const nextFile = this.serverFileArray[nextIndex];
    const isSingle = false;
    console.log('nextplay-----', nextFileIndex);
    this.download( nextFile, nextIndex, isSingle);
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

  downloadNext(tempIsPlayingAll, cFileIndex) {
    const nextFileIndex = cFileIndex + 1;
    if (this.serverFileArray.length > nextFileIndex && !this.serverFileArray[nextFileIndex].isFileDownloaded && tempIsPlayingAll) {
      this.download(this.serverFileArray[nextFileIndex], nextFileIndex, false, false);
    }
  }
  playAll(){
    this.isPlayingAll = true;
    this.cancelAll = false;
    // this.testnextFileIndex = 0;
    // this.playRecording();
    this.download( null, this.testnextFileIndex, false);
  }
  newallStop(){
    this.stopPlayRecording();
    this.isPlayingAll =  false;
  }
  stopPlayRecording() {
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

  getProgressVal(e, f) {
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

  async download(sf, i, dd, playAudio = true) {
    try {
      if(playAudio){
        this.stopPlayRecording();
      }
    } catch (e) {}
    sf = this.serverFileArray[i];
    console.log('SfFull Data', sf);
    await this.platform.ready();
    if (this.platform.is('android')) {
      this.androidPermissions.hasPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
        .then(status => {
          if (status.hasPermission) {
            this.createShabad(sf, i, dd, playAudio);
          } else {
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
              .then(status => {
                if (status.hasPermission) {
                  this.createShabad(sf, i, dd, playAudio);
                }
              });
          }
        });
    } else if (this.platform.is('ios')) {
      this.createShabad(sf, i, dd, playAudio);
    }
  }

  createShabad(sf, i, dd, playAudio) {
    this.file.createDir(this.storageDirectory, VARS.shabadDirectory, false).then(response => {
      this.createAngDir(sf, i, dd, playAudio);
    }).catch(err => {
      if (err.message == 'PATH_EXISTS_ERR') {
        this.createAngDir(sf, i, dd, playAudio);
      }
    });
  }


  createAngDir(sf, i, dd, playAudio) {
    this.file.createDir(this.storageDirectory + VARS.shabadDirectory, VARS.angDir + sf.ang_id, false).then(response => {
      this.downloadAudioFile(sf, i, dd, playAudio);
    }).catch(err => {
      if (err.message == 'PATH_EXISTS_ERR') {
        this.downloadAudioFile(sf, i, dd, playAudio);
      }
    });
  }

  scrollTo(index) {
    document.getElementById('currentPlayReadItemId' + index.toString()).scrollIntoView({ behavior: 'smooth' });
    console.log('index-----', index);
  }
  downloadAudioFile(sf, i, dd, playAudio = true) {
    console.log('check', this.cancelAll, 'this.cancelAll  ', sf, 'sf'  , dd, ' dd');
    const checkFileUrl = this.storageDirectory + '/' + VARS.shabadDirectory + '/' + VARS.angDir + sf.ang_id + '/';
    const FileName = 'shabad_' + sf._id + '.mp3';
    this.file.checkFile(checkFileUrl, FileName).then((entry) => {
      const nurl = this.storageDirectory + '/' + VARS.shabadDirectory + '/' + VARS.angDir + sf.ang_id + '/shabad_' + sf._id + '.mp3';
      sf.isDownloading = false;
      sf.isFileDownloaded = true;
      if ((this.cancelAll && dd && playAudio) || (!this.cancelAll && !dd && playAudio)){
        setTimeout(() => {
          this.playRecording(sf, i, dd, nurl);
        }, 300);
        try {
          this.downloadNext(!dd, i);
        } catch (e) {}
      }
    }).catch((err) => {
      const url = this.newHelper.returnDownloadUrl(sf.ang_id, sf._id);
      const fileTransfer: FileTransferObject = this.transfer.create();
      if (!this.online){
        this.checkNetwork();
        this.newallStop();
      } else{
        if (playAudio) {
          sf.isDownloading = true;
          this.scrollTo(i);
        }
        fileTransfer.download(url, this.storageDirectory + '/' + VARS.shabadDirectory + '/' + VARS.angDir + sf.ang_id + '/shabad_' + sf._id + '.mp3').then((entry) => {
          const nurl = this.storageDirectory + '/' + VARS.shabadDirectory + '/' + VARS.angDir + sf.ang_id + '/shabad_' + sf._id + '.mp3';
          sf.isDownloading = false;
          sf.isFileDownloaded = true;
          console.log('Inside Download For Play', this.cancelAll, 'this.cancelAll  ', sf, 'sf' );
          if ((this.cancelAll && dd && playAudio) || (!this.cancelAll && !dd && playAudio)){
            setTimeout(() => {
              this.playRecording(sf, i, dd, nurl);
            }, 300);
          }
          try {
            this.downloadNext(!dd, i);
          } catch (e) {}
        }).catch((err) => {
          if (err.http_status == 404) {
            sf.isDownloading = false;
            sf.isFileDownloaded = false;
            if (playAudio) {
              if (!dd){
                this.presentAlertConfirm((i+1));
              } else {
                this.newHelper.presentToastWithOptions('Shabad Not Found on Server', 'middle');
              }
            }
          }
        });
      }
    });

  }

  async presentAlertConfirm(nextIndex) {
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
            this.nextplay(nextIndex);
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
  checkWriter(writerId){
    let name = '';
    this.writerNames.map(wr=>{
      if(wr._id === writerId){
        name = wr.writer_name;
      }
    })
    return name;
  }

  checkRaag(raagId){
    let raag = '';
    this.raagJsonArray.map(rg=>{
      if(rg._id === raagId){
        raag = rg.raag_english;
      }
    })
    return raag;
  }
}
