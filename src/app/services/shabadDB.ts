
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Song } from './song';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})

export class shabadDB {
  private storage: SQLiteObject;
  listItem = new BehaviorSubject([]);
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private platform: Platform,
    private sqlite: SQLite,
    private httpClient: HttpClient,
    private sqlPorter: SQLitePorter,
  ) {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'igurubani.db',
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

  fetchSongs(): Observable<Song[]> {
    return this.listItem.asObservable();
  }

  // Render fake data
  getFakeData() {
    this.httpClient.get(
      'assets/gurubaniSQL/shortShabad.sql',
      { responseType: 'text' }
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
  getSongs() {
    //   'select * from shabad order by _id desc limit 20'
    return this.storage.executeSql('SELECT * FROM shabad', []).then(res => {
      let items = [];
      console.log('Gurubani getSong Functions Response', res);
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items = this.setData(res);
        }
      }
      return items;
      // this.listItem.next(items);
    });
  }


  searchShabadAnyWhere(text) {
    text = '%' + text + '%'
    return this.storage.executeSql('SELECT * FROM shabad WHERE transliteration LIKE ? OR english_ssk LIKE ? LIMIT 10', [text, text]).then(res => {
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
    return this.storage.executeSql('SELECT * FROM shabad WHERE transliteration LIKE ? OR english_ssk LIKE ? LIMIT 10', [text, text]).then(res => {
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
    'Select * FROM shabad WHERE source_id="G" LIMIT 0, 20'
    return this.storage.executeSql('SELECT * FROM shabad WHERE source_id="G" LIMIT 10 OFFSET ?', [offset]).then(res => {
      let items = [];
      if (res.rows.length > 0) {
        items = this.setData(res);
      }
      return items;
    });
  }

  searchShabadAnyWhereLoadMoreandOffset(data) {
    let text = '%' + data.searchString + '%'
    return this.storage.executeSql('SELECT * FROM shabad WHERE source_id="G" AND transliteration LIKE ? OR english_ssk LIKE ? LIMIT 10 OFFSET ?', [text, text, data.offset]).then(res => {
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

    return this.storage.executeSql('SELECT * FROM shabad WHERE source_id="G" AND transliteration LIKE ? OR english_ssk LIKE ? LIMIT 10 OFFSET ?', [text, text, data.offset]).then(res => {
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
      itt.push({
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
      });
    }
    return itt;
  }
}