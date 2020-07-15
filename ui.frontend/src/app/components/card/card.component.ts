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
  @Input() pageTitle: string;
  @Input() pageLastModified: number;
  @Input() link: string;
  @Input() linkText: string;

  constructor() { }

  get hasContent(): boolean {
    return this.src && this.src.trim().length > 0;
  }

  get hasLink(): boolean {
    return this.link && this.link.trim().length > 0 && this.linkText && this.linkText.trim().length > 0;
  }

  get lastModifiedDate(): string {
    const lastModifiedDate = new Date(this.pageLastModified);

    if (this.pageLastModified && lastModifiedDate) {
      return lastModifiedDate.toLocaleDateString();
    }
    return null;
  }

  ngOnInit(): void {
  }

}

MapTo('wknd-spa-angular/components/card')(CardComponent, CardEditConfig);
