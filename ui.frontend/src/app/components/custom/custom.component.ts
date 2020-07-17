import { Component, Input, OnInit } from '@angular/core';

const CustomEditConfig = {
  emptyLabel: 'Custom Component',
  isEmpty: cqModel =>
    !cqModel || !cqModel.message || cqModel.message.trim().length < 1
};

@Component({
  selector: 'app-custom',
  templateUrl: './custom.component.html',
  styleUrls: ['./custom.component.css']
})
export class CustomComponent implements OnInit {

  @Input() message: string;

  constructor() { }

  ngOnInit(): void {
  }

}
