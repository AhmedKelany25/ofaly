import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FutureItemComponent } from './future-item.component';

describe('FutureItemComponent', () => {
  let component: FutureItemComponent;
  let fixture: ComponentFixture<FutureItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FutureItemComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(FutureItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
