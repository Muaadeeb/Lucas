import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { QuestionNode } from "./QuestionNode";

export interface IImporter {
  Import: (modalService: NgbModal) => QuestionNode;
}
