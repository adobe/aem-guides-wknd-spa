import {Component, Input, OnInit} from '@angular/core';
import { MapTo } from '@adobe/aem-angular-editable-components';

const ImageEditConfig = {
  emptyLabel: 'Image',
  isEmpty: cqModel =>
    !cqModel || !cqModel.src || cqModel.src.trim().length < 1
};

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit {

  @Input() src: string;
  @Input() alt: string;
  @Input() title: string;

  constructor() { }

  get hasImage() {
    return this.src && this.src.trim().length > 0;
  }

  ngOnInit() { }
}

// Use Angular Core Component instead
// MapTo('wknd-spa-angular/components/image')(ImageComponent, ImageEditConfig);
