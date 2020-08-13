import { Injectable, NgZone } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Storage } from "@ionic/storage";

@Injectable({
    providedIn: 'root'
})

export class raagDB {
    private storage: SQLiteObject;
    songsList = new BehaviorSubject([]);
    private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
    constructor(
        private platform: Platform, 
        private sqlite: SQLite, 
        private httpClient: HttpClient,
        private sqlPorter: SQLitePorter,

    ) {
        this.platform.ready().then(() => {
            this.sqlite.create({
              name: 'positronx_db.db',
              location: 'default'
            })
            .then((db: SQLiteObject) => {
                this.storage = db;
                this.getFakeData();
            });
          });
    }

    dbState() {
        return this.isDbReady.asObservable();
      }
     
      fetchSongs(){
        return this.songsList.asObservable();
      }
    
        // Render fake data
        getFakeData() {
          this.httpClient.get(
            'assets/gurubaniSQL/raag.sql', 
            {responseType: 'text'}
          ).subscribe(data => {
            this.sqlPorter.importSqlToDb(this.storage, data)
              .then(_ => {
                this.getSongs();
                this.isDbReady.next(true);
              })
              .catch(error => console.error(error));
          });
        }
    
      // Get list
      getSongs(){
        return this.storage.executeSql('SELECT * FROM raag', []).then(res => {
          let items = [];
          if (res.rows.length > 0) {
            for (var i = 0; i < res.rows.length; i++) { 
              items.push({ 
                _id: res.rows.item(i)._id,
                raag_gurmukhi: res.rows.item(i).raag_gurmukhi,  
                raag_english: res.rows.item(i).raag_english
               });
            }
          }
          this.songsList.next(items);
        });
      }
    
    
  
}