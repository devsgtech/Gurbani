
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import {Storage} from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})

export class shabadDB {
  public storage: SQLiteObject;
  listItem = new BehaviorSubject([]);
  rowCount = 0;
  data_:any;
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public dbCopiedReady: BehaviorSubject<any> = new BehaviorSubject(false);

  constructor(
    private platform: Platform,
    private sqlite: SQLite,
    private httpClient: HttpClient,
    private localStorage: Storage,
  ) {
    this.platform.ready().then(() => {
      this.dbCopiedReady.subscribe(async (isDb) => {
        console.log('dbCopiedReady', isDb)
        if (isDb) {
          this.sqlite.create({
            name: 'gurbani.db',
            location: 'default'
          }).then(async (db: SQLiteObject) => {
            this.storage = db;
            await this.localStorage.set('_Loaded_Db_INTO_DEVICE', true);
            setTimeout(() => {
              this.getDataOffset(0);
              this.isDbReady.next(true);
            }, 100);
          }).catch(() => {});
        }
      });
    });
  }

  dbState() {
    return this.isDbReady.asObservable();
  }

  fetchSongs(){
    return this.listItem.asObservable();
  }
  dropTable(){
    let sqli = 'DROP TABLE IF EXISTS `shabad`';
    this.storage.executeSql(sqli, []).then(res => {
      console.log('Table Dropped', res);
    });
  }
  searchShabadAnyWhere(text) {
    text = '%' + text + '%'
    console.log('text in search Db', text)
    return this.storage.executeSql('SELECT * FROM shabad WHERE source_id="G" AND transliteration LIKE ? OR english_ssk LIKE ?  OR punjabiVersion LIKE ?LIMIT 10', [text, text, text]).then(res => {
      let items = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items = this.setData(res);
        }
      }
      return items;
    });
  }

  searchShabadFirstWord(text) {
    text = text + '%'
    return this.storage.executeSql('SELECT * FROM shabad WHERE transliteration LIKE ? OR english_ssk LIKE ? punjabiVersion LIKE ?  LIMIT 10', [text, text,text]).then(res => {
      let items = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items = this.setData(res);
        }
      }
      return items;
    });
  }

  getDataOffset(offset) {
    // 'Select * FROM shabad WHERE source_id="G" LIMIT 0, 20'
    return this.storage.executeSql('SELECT * FROM shabad WHERE source_id="G" LIMIT 10 OFFSET ?', [offset]).then(res => {
      let items :any;
      console.log('get Data ', res)
      if (res.rows.length > 0) {
        items = []
        items = this.setData(res);
      }
      this.listItem.next(items);
      return items;
    }).catch(() => {});
  }

  searchShabadAnyWhereLoadMoreandOffset(data) {
    let text = '%' + data.searchString + '%'
    return this.storage.executeSql('SELECT * FROM shabad WHERE source_id="G" AND transliteration LIKE ? OR english_ssk LIKE ? OR punjabiVersion LIKE ? LIMIT 10 OFFSET ?', [text, text, text,data.offset]).then(res => {
      let items = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items = this.setData(res);
        }
      }
      return items;
    });
  }

  searchShabadFirstWordLoadMoreandOffset(data) {
    let text = data.searchString + '%'

    return this.storage.executeSql('SELECT * FROM shabad WHERE source_id="G" AND transliteration LIKE ? OR english_ssk LIKE ? OR punjabiVersion LIKE ? LIMIT 10 OFFSET ?', [text, text,text, data.offset]).then(res => {
      let items = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items = this.setData(res);
        }
      }
      return items;
    });
  }

  setData(res) {
    let itt = [];
    for (var i = 0; i < res.rows.length; i++) {
      /*itt.push({
        _id: res.rows.item(i)._id,
        shabad_no: res.rows.item(i).shabad_no,
        source_id: res.rows.item(i).source_id,
        ang_id: res.rows.item(i).ang_id,
        line_id: res.rows.item(i).line_id,
        writer_id: res.rows.item(i).writer_id,
        raag_id: res.rows.item(i).raag_id,
        vishraam: res.rows.item(i).vishraam,
        green_vishraam: res.rows.item(i).green_vishraam,
        first_ltr_start: res.rows.item(i).first_ltr_start,
        first_ltr_any: res.rows.item(i).first_ltr_any,
        gurmukhi: res.rows.item(i).gurmukhi,
        english_ssk: res.rows.item(i).english_ssk,
        english_bms: res.rows.item(i).english_bms,
        punjabi_bms: res.rows.item(i).punjabi_bms,
        transliteration: res.rows.item(i).transliteration,
        sggs_darpan: res.rows.item(i).sggs_darpan,
        faridkot_teeka: res.rows.item(i).faridkot_teeka,
         punjabiVersion: res.rows.item(i).punjabiVersion,
      });*/
      itt.push(res.rows.item(i));
    }
    return itt;
  }


  searchShabadAngVaar(text) {
    text = '%' + text + '%';
    console.log('Click Search Ang id', 'SELECT * FROM shabad WHERE ang_id LIKE ? LIMIT 10', text)
    return this.storage.executeSql('SELECT * FROM shabad WHERE ang_id LIKE ? LIMIT 10', [text]).then(res => {
      let items = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items = this.setData(res);
        }
      }
      return items;
    });
  }


  commonFilter(sqlCommand, arrayText){
    console.log('Common filter Call', sqlCommand ,'-->array',arrayText)
    return this.storage.executeSql(sqlCommand,arrayText).then(res => {
      let items = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items = this.setData(res);
        }
      }
      return items;
    });
  }
}
