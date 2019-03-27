import { Component } from '@angular/core';

/**
 * Generated class for the LoadingModalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'loading-modal',
  templateUrl: 'loading-modal.html'
})
export class LoadingModalComponent {

  text: string;

  constructor() {
    console.log('Hello LoadingModalComponent Component');
    this.text = 'Hello World';
  }

}
