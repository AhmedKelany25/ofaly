import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewGroupPage } from './new-group.page';

describe('NewGroupPage', () => {
  let component: NewGroupPage;
  let fixture: ComponentFixture<NewGroupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewGroupPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewGroupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
