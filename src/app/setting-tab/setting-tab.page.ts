import { Component, OnInit, Input } from '@angular/core';
import { ChangeUIService } from '../services/change-ui.service';
import { Platform, ToastController } from '@ionic/angular';
import { DbService } from '../services/newdb';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { iGurubaniDB } from '../services/gurubaniDb';
import { shabadDB } from '../services/shabadDB';

@Component({
  selector: 'app-setting-tab',
  templateUrl: './setting-tab.page.html',
  styleUrls: ['./setting-tab.page.scss'],
})
export class SettingTabPage implements OnInit {
  font: any = 16;
  dd:any = 1;
  true = true;
  false = false;
  @Input() name: string;
  mainForm: FormGroup;
  Data= [];
  constructor(
    public changeui:ChangeUIService,
    private platform: Platform,
    // private igdb: DbService,
    // private igdb : iGurubaniDB,
    private igdb : shabadDB,
    public formBuilder: FormBuilder,
    private toast: ToastController,
    private router: Router,
  ) { }

  ngOnInit() {
    this.changeFont();
  }

  changeFont(){
    console.log(this.font, 'this.font')
    if(this.font == 12 ){
      this.changeui.fontSize = 'font-12'
    }
    if(this.font == 16 ){
      this.changeui.fontSize = 'font-16'
    }
    if(this.font == 20 ){
      this.changeui.fontSize = 'font-20'
    }
    if(this.font == 24 ){
      this.changeui.fontSize = 'font-24'
    }
  }
change(){
  console.log(this.dd,'sdf')
  let data_ = this.dd==1 ? false : this.true; 
  console.log(data_,'data_')

  this.changeui.setAppTheme(data_);
}
 

// ngOnInit() {
//   this.igdb.dbState().subscribe((res) => {
//     console.log('res', res);
//     if(res){
//       this.igdb.fetchSongs().subscribe(item => {
//        console.log('item', item);
//         this.Data = item
//       })
//     }
//   });

//   this.mainForm = this.formBuilder.group({
//     artist: [''],
//     song: ['']
//   })

//   console.log('Data', this.Data);
// }

// storeData() {
//   this.igdb.addSong(
//     this.mainForm.value.artist,
//     this.mainForm.value.song
//   ).then((res) => {
//     this.mainForm.reset();
//   })
// }

// deleteSong(id){
//   this.igdb.deleteSong(id).then(async(res) => {
//     let toast = await this.toast.create({
//       message: 'Song deleted',
//       duration: 2500
//     });
//     toast.present();      
//   })
// }

// getData(){
//   this.igdb.getSongs().then((res) => {
//    console.log('Resopnse GetData0', res);
//    this.Data = res;
//   })
// }

// remove(){
//   this.Data =[];
//   console.log('remove Data', this.Data);
// }
}
