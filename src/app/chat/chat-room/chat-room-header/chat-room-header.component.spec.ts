import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { ChatRoomHeaderComponent } from "./chat-room-header.component";

describe("ChatRoomHeaderComponent", () => {
  let component: ChatRoomHeaderComponent;
  let fixture: ComponentFixture<ChatRoomHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChatRoomHeaderComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatRoomHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
