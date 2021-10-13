import { Component, OnInit } from '@angular/core';
import { AudioRecordingService } from './services/audio-recording.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-audio',
  templateUrl: './audio.page.html',
  styleUrls: ['./audio.page.scss'],
})
export class AudioPage implements OnInit {


  isRecording = false;
  recordedTime;
  blobUrl;
  blobUrlArr = []

  constructor(private audioRecordingService: AudioRecordingService, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.audioRecordingService.recordingFailed().subscribe(() => {
      this.isRecording = false;
    });

    this.audioRecordingService.getRecordedTime().subscribe((time) => {
      this.recordedTime = time;
    });

    this.audioRecordingService.getRecordedBlob().subscribe((data) => {
      this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob));
    });

  }

  startRecording() {
    if (!this.isRecording) {
      this.isRecording = true;
      this.audioRecordingService.startRecording();
    }
  }
  stopRecording() {
    if (this.isRecording) {
      this.audioRecordingService.stopRecording();
      this.isRecording = false;
      if(this.blobUrlArr.length < 1){
        this.audioRecordingService.getRecordedBlob().subscribe((data) => {
          this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob));
          this.blobUrlArr.push(this.blobUrl);
        })
      }
    }
  }
}
