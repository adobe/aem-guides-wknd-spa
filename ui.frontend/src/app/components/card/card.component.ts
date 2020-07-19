import { Component, Input, OnInit } from '@angular/core';
import {MapTo} from '@adobe/cq-angular-editable-components';

const CardEditConfig = {
  emptyLabel: 'Card',
  isEmpty: cqModel =>
    !cqModel || !cqModel.src || cqModel.src.trim().length < 1
};

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() src: string;
  @Input() alt: string;
  @Input() title: string;

  constructor() { }

  get hasContent(): boolean {
    return this.src && this.src.trim().length > 0;
  }

  ngOnInit(): void {
  }

}

MapTo('wknd-spa-angular/components/card')(CardComponent, CardEditConfig);
