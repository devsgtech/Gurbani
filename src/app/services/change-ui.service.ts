import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ChangeUIService {
  phonetic = '';
  english  = '';

  fontSize = 'font-12';
  darkMode : boolean = false;
  constructor(
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
}
