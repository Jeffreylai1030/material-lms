import { Component, OnInit, Inject } from '@angular/core';
import { DynamicFormModel, DynamicInputModel, DynamicFormService } from '@ng-dynamic-forms/core';

import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  formGroup: FormGroup = new FormGroup({});
  constructor(
    private formService: DynamicFormService,
    public dialog: MatDialogRef<FormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.formGroup = this.formService.createFormGroup(this.data.formModel);
  }

  onCancel() {
    this.dialog.close();
  }

  onSubmit() {
    if (this.formGroup.valid) {
      this.dialog.close(this.formGroup.value);
    }
  }

}
