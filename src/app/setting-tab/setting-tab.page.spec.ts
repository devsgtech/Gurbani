import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SettingTabPage } from './setting-tab.page';

describe('SettingTabPage', () => {
  let component: SettingTabPage;
  let fixture: ComponentFixture<SettingTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingTabPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
