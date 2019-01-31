import { IImporter } from "../../common/IImporter";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TextImporterComponent } from "./text-importer.component";

export class TextImporter implements IImporter {
  Import(modalService: NgbModal) {
    let result = modalService.open(TextImporterComponent);
    return null;
  }
}
