import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PastItemComponent } from './past-item.component';

describe('PastItemComponent', () => {
  let component: PastItemComponent;
  let fixture: ComponentFixture<PastItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PastItemComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(PastItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
