import { Component, OnInit } from '@angular/core';
import { QuestionNode } from '../common/QuestionNode';
import { Question } from '../common/Question';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  exampleNode = new QuestionNode(
    "Root!",
    [
      new Question(
        "Very cool question",
        "I am cool",
        ["Other thang", "stuff"],
        false,
        new Date(),
        new Date(),
        1,
        2,
        1
      )
    ],
    [
      new QuestionNode(
        "Child",
        null,
        null
      ),
      new QuestionNode(
        "Another Child",
        null,
        [
          new QuestionNode(
            "SUPA CHILD",
            [
              new Question(
                "the questions within",
                "Woah",
                ["Another Woah", "Minds Blown"],
                true,
                new Date(),
                new Date(),
                3,
                2,
                2
              )
            ]
          )
        ]
      )
    ],
  );
  constructor() { }

  ngOnInit() {
  }

}
