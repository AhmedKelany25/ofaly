import {
  Directive,
  ElementRef,
  Input,
  AfterViewInit,
  NgZone,
  EventEmitter,
  Output
} from "@angular/core";
import { GestureController } from "@ionic/angular";

@Directive({
  selector: '[appLongPress]'
})
export class LongPressDirective implements AfterViewInit {

  @Output() press = new EventEmitter();
  @Input("delay") delay =  100;
  action: any; //not stacking actions

  private longPressActive = false;

  constructor(
                  private el: ElementRef, 
                  private gestureCtrl: GestureController, 
                  private zone: NgZone
              ) {}
  
  ngAfterViewInit() {
      this.loadLongPressOnElement();
  }    

  loadLongPressOnElement() {
      const gesture = this.gestureCtrl.create({
          el: this.el.nativeElement,
          threshold: 0,
          gestureName: 'long-press',          
          onStart: ev => {                                       
              this.longPressActive = true;
              this.longPressAction();
              console.log('started')
          },
          onEnd: ev => {                
              this.longPressActive = false;
              console.log('ended')

          }
      });
      gesture.enable();
  }
  
  private longPressAction() {
      if (this.action) {
          clearInterval(this.action);
      }
      this.action = setTimeout(() => {
              if (this.longPressActive) {
                  // this.longPressActive = false;
                  this.press.emit();
              }
          
      },100);
  }
}
