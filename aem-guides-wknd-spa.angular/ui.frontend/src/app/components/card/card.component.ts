import { Component, Input, OnInit } from '@angular/core';
import { MapTo } from '@adobe/aem-angular-editable-components';

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
  @Input() cardTitle: string;
  @Input() cardLastModified: number;
  @Input() ctaLinkURL: string;
  @Input() ctaText: string;

  constructor() { }

  get hasContent(): boolean {
    return this.src && this.src.trim().length > 0;
  }

  get hasCTA(): boolean {
    return this.ctaLinkURL && this.ctaLinkURL.trim().length > 0 && this.ctaText && this.ctaText.trim().length > 0;
  }

  get lastModifiedDate(): string {
    const lastModifiedDate = this.cardLastModified ? new Date(this.cardLastModified) : null;

    if (lastModifiedDate) {
      return lastModifiedDate.toLocaleDateString();
    }
    return null;
  }

  ngOnInit(): void {
  }

}

MapTo('wknd-spa-angular/components/card')(CardComponent, CardEditConfig);
