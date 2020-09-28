import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AngListPage } from './ang-list.page';

describe('AngListPage', () => {
  let component: AngListPage;
  let fixture: ComponentFixture<AngListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AngListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AngListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
