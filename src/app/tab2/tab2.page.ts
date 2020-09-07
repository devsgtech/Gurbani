import { Component, OnInit ,ViewChild} from '@angular/core';
import { Platform } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { MenuController } from '@ionic/angular';
import { shabadDB } from '../services/shabadDB';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Storage } from '@ionic/storage';
import { newhelper } from '../services/newhelper';
import { Network } from '@ionic-native/network/ngx';
import { ChangeUIService } from '../services/change-ui.service';
import { ListComponent } from 'src/app/Components/list/list.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  @ViewChild(ListComponent) listComp:ListComponent;

  favourite = true;
  storageDirectory: any; currPlayingFile: MediaObject;
  getDurationInterval: any;
  getPositionInterval: any;
  serverFileArray: any;
  listItemFromDb = [];
  isPlayingAll = false;
  driveAudio:any;
  online :boolean = true;
  constructor(public platform: Platform,
    private file: File,
    private transfer: FileTransfer,
    private androidPermissions: AndroidPermissions,
    private igdb: shabadDB,
    private menu: MenuController,
    private storage: Storage,
    public changeui: ChangeUIService,
    private newHelper: newhelper,
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
      this.listComp.stopPlayRecording();
    });
  }
  static scrollTo(index) {
    const currentId = document.getElementById('currentPlayItemId' + index);
    currentId.scrollIntoView({ behavior: 'smooth' });
  }
  ngOnInit() {
    
  }
  ionViewWillLeave() {
    this.stopPlaying(null);
    this.listComp.stopPlayRecording();
  }

  ionViewWillEnter() {
    this.listComp.getDataFromLocalStorage();
    this.online = (this.network.type !== this.network.Connection.NONE);
    this.network.onChange().subscribe((ev) => {
      this.online = (ev.type === 'online');
    });
    this.getDataFromLocalStorage();
  }
 

  getDataFromLocalStorage() {
    this.storage.get('_SGTECH_GURBANI_FAV').then((sdata: any) => {
      console.log(sdata, 'Storage Data',sdata)
      this.listItemFromDb = sdata;
    }).catch(e => console.log("Error =>" ,e));
  }

  /////////////////Play Favourite //////////////////////
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
    this.file.createDir(this.storageDirectory, '.shabad', false).then(response => {
      this.createAngDir(sf, i, dd);
    }).catch(err => {
      if (err.message == 'PATH_EXISTS_ERR') {
        this.createAngDir(sf, i, dd)
      }
    });
  }

  createAngDir(sf, i, dd) {
    console.log('CreateDirc Function', this.storageDirectory + '.shabad', 'ang_' + sf.ang_id)
    this.file.createDir(this.storageDirectory + '.shabad', 'ang_' + sf.ang_id, false).then(response => {
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
    let checkFileUrl = this.storageDirectory + '/.shabad/' + 'ang_' + sf.ang_id + '/';
    let FileName = 'shabad_' + sf._id + '.mp3';
    this.file.checkFile(checkFileUrl, FileName).then((entry) => {
      let nurl = this.storageDirectory + '/.shabad/' + 'ang_' + sf.ang_id + '/shabad_' + sf._id + '.mp3';
      sf.isDownloading = false;
      this.ply1(sf, i, dd, nurl);
    })
      .catch((err) => {
       
        let url = 'https://firebasestorage.googleapis.com/v0/b/testgurubani.appspot.com/o/ang_' + sf.ang_id + '%2Fshabad_' + sf._id + '.mp3?alt=media&token=fcfe83f3-f21c-4d77-a4b8-438f0e53281a'
        const fileTransfer: FileTransferObject = this.transfer.create();
        if(!this.online){
          this.checkNetwork();
        } else{
          sf.isDownloading = true;
        fileTransfer.download(url, this.storageDirectory + '/.shabad/' + 'ang_' + sf.ang_id + '/shabad_' + sf._id + '.mp3').then((entry) => {
          let nurl = this.storageDirectory + '/.shabad/' + 'ang_' + sf.ang_id + '/shabad_' + sf._id + '.mp3';
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

  async checkNetwork() {
    await this.newHelper.presentToastWithOptions(this.online ? 'You are connected to internet, woohoo!' : 'You are not connected to internet!');
  }

  ply1(sf, i, dd, url) {
    console.log('url',url)
    sf.isDownloading = false;
    sf.isPlaying = true;
    const file: MediaObject = this.media.create(url);
    this.driveAudio = file;
    this.driveAudio.play();
    this.driveAudio.onSuccess.subscribe(() => {
      this.stopPlaying(sf);
    })
  }
  stopPlaying(sf) {
    sf? sf.isPlaying = false:null;
    if (this.driveAudio) {
      this.driveAudio.stop();
    }
  }


  removaFavourite(i) {
    console.log('i',i)

    this.storage.get('_SGTECH_GURBANI_FAV').then((sdata: any) => {
    console.log('sdata',sdata[i])
     sdata.splice(i, 1);
      this.listItemFromDb = sdata;
      this.storage.set('_SGTECH_GURBANI_FAV', sdata);
    }).catch(e => console.log(e));
  }
  /////////////////Play End favourite/////////////////////
}

