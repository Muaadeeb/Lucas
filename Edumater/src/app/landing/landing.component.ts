import { Component, OnInit } from '@angular/core';
import { QuestionNode } from '../common/QuestionNode';
import { Question } from '../common/Question';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  exampleNode: QuestionNode = new QuestionNode(
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
      {
        Name: "Child",
        Questions: [],
        Expanded: false,
        QuestionsVisible: false,
        Children: null
      },
      {
        Name: "Another Child",
        Questions: [],
        Expanded: false,
        QuestionsVisible: false,
        Children: [
          {
            Name: "SUPA CHILD",
            Questions: [
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
            ],
            Children: null,
            Expanded: false,
            QuestionsVisible: false
          }
        ]
      }
    ],
    false,
    false
  );
  constructor() { }

  ngOnInit() {
  }

}
