import {Component, OnInit} from '@angular/core';
import {APP_URLS} from '../services/constantString';
import {HelperService} from '../services/helper.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  tilesArray = [
    {
      punjabiWord: 'ਜਪੁਜੀ ਸਾਹਿਬ',
      englishWord: 'Japji Sahib',
      id: 1,
    },
    {
      punjabiWord: 'ਅਨੰਦੁ ਸਾਹਿਬ',
      englishWord: 'Anand Sahib',
      id: 2,
    },
    {
      punjabiWord: 'ਸੁਖਮਨੀ ਸਾਹਿਬ',
      englishWord: 'Sukhmani Sahib',
      id: 3,
    },
    {
      punjabiWord: 'ਕੀਰਤਨ ਸੋਹਿਲਾ',
      englishWord: 'Kirtan Sohila',
      id: 4,
    },
    
  ]
  constructor(private helper: HelperService) {
  }
 
  ngOnInit() {
  }
  readBook(item) {
    this.helper.pushPage(APP_URLS.READ_DETAIL, item).catch(() => {});
  }
}
