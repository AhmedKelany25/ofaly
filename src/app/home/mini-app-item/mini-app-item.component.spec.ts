import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MiniAppItemComponent } from './mini-app-item.component';

describe('MiniAppItemComponent', () => {
  let component: MiniAppItemComponent;
  let fixture: ComponentFixture<MiniAppItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiniAppItemComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MiniAppItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
