import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ThemeDetection } from '@ionic-native/theme-detection/ngx';

@Injectable({
  providedIn: 'root'
})
export class ChangeUIService {
  phonetic :Boolean = true;
  english :Boolean = true;

  fontSize = 'font-16';
  phoneticFont = 'font-16';
  gurmukhiFont  = 'font-16';
  darkMode : boolean = false;
  themeToggleValue = 1;
  constructor(
    private td: ThemeDetection,
    private platform: Platform,
  ) { 
    this.platform.ready().then(()=>{
      const prefDark = window.matchMedia("(prefers-color-scheme: dark)");
      prefDark.addListener(e =>{
        console.log('setTheme', e),
        this.setAppTheme(e.matches);
      })
    })
  }

  toggleApp(){
    this.darkMode = !this.darkMode;
    this.setAppTheme(this.darkMode);
  }
  setAppTheme(dark){
    this.darkMode = dark;
    if(this.darkMode){
      document.body.classList.add("dark")
    } else{
      document.body.classList.remove("dark")
    }
   
  }


  themeDetection(){
    console.log('-<Theme Detection Function call dfrom Search tab');
    this.td.isAvailable()
    .then((res) => {
       if(res.value) {
         this.td.isDarkModeEnabled().then((res) => {
           console.log(res, '-<Theme Detection');
           if(res.value == true){
             this.themeToggleValue = 0;
           }else {
            this.themeToggleValue = 1;
          }
          this.changeUIdarkMode();
         })
         .catch((error: any) => console.error(error));
       }
    })
    .catch((error: any) => console.error(error));
    
  }


  changeUIdarkMode(){
    let data_ = this.themeToggleValue==1 ? false : true; 
    this.setAppTheme(data_);
  }
}
