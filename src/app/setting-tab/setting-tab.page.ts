import { Component, OnInit, Input } from '@angular/core';
import { ChangeUIService } from '../services/change-ui.service';
import { Platform,  } from '@ionic/angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ThemeDetection } from "@ionic-native/theme-detection/ngx";

@Component({
  selector: 'app-setting-tab',
  templateUrl: './setting-tab.page.html',
  styleUrls: ['./setting-tab.page.scss'],
})
export class SettingTabPage implements OnInit {
  font: any = 16;
  dd:any = this.changeui.themeToggleValue;
  true = true;
  false = false;
  englishTranslation: any;
  phoneticFont: any = 16;
  gurmukhiFont: any = 16;
  @Input() name: string;
  mainForm: FormGroup;
  Data= [];
  constructor(private themeDetection: ThemeDetection,
    public changeui:ChangeUIService,
    private platform: Platform,
    public formBuilder: FormBuilder,
   
  ) { }

  ngOnInit() {
    this.changeFont();
 
  }

  ionViewWillEnter(){
   
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

  phoneticchangeFont(){
    console.log(this.phoneticFont, 'this.font')
    if(this.phoneticFont == 12 ){
      this.changeui.phoneticFont = 'font-12'
    }
    if(this.phoneticFont == 16 ){
      this.changeui.phoneticFont = 'font-16'
    }
    if(this.phoneticFont == 20 ){
      this.changeui.phoneticFont = 'font-20'
    }
    if(this.phoneticFont == 24 ){
      this.changeui.phoneticFont = 'font-24'
    }
  }

  gurmukhiFontChange(){
    console.log(this.gurmukhiFont, 'this.font')
    if(this.gurmukhiFont == 12 ){
      this.changeui.gurmukhiFont = 'font-12'
    }
    if(this.gurmukhiFont == 16 ){
      this.changeui.gurmukhiFont = 'font-16'
    }
    if(this.gurmukhiFont == 20 ){
      this.changeui.gurmukhiFont = 'font-20'
    }
    if(this.gurmukhiFont == 24 ){
      this.changeui.gurmukhiFont = 'font-24'
    }
  }
change(){
  console.log(this.dd,'sdf')
  let data_ = this.dd==1 ? false : this.true; 
  console.log(data_,'data_')
  console.log('englishTranslation', this.changeui.english)

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
