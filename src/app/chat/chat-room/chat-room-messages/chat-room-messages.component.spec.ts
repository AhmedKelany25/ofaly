import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { ChatRoomMessagesComponent } from "./chat-room-messages.component";

describe("ChatRoomMessagesComponent", () => {
  let component: ChatRoomMessagesComponent;
  let fixture: ComponentFixture<ChatRoomMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChatRoomMessagesComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatRoomMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
