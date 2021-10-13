import { EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { IonTextarea } from '@ionic/angular';

@Component({
  selector: 'app-chat-room-input',
  templateUrl: './chat-room-input.component.html',
  styleUrls: ['./chat-room-input.component.scss'],
})
export class ChatRoomInputComponent implements OnInit {
  @Input('draft') private readonly draft$: string;
  @Output() private readonly draftChange = new EventEmitter<string>();
  @Output() private readonly sendMessage = new EventEmitter<void>();
  @Output() readonly keyboardUp = new EventEmitter<void>();

  @ViewChild(IonTextarea) private readonly messageInput: IonTextarea;

  constructor() {}

  ngOnInit() {}

  get draft() {
    return this.draft$;
  }

  set draft(value: string) {
    this.draftChange.emit(value);
  }

  send() {
    this.messageInput.setFocus();
    this.sendMessage.emit();
  }
}
