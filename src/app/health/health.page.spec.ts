import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NgMedicalPage } from './health.page';

describe('NgMedicalPage', () => {
  let component: NgMedicalPage;
  let fixture: ComponentFixture<NgMedicalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NgMedicalPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(NgMedicalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
