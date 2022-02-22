import { CodeDto } from './../../../models/code-dto';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BookFormComponent } from '../../book/book-form/book-form.component';

@Component({
  selector: 'app-code-form',
  templateUrl: './code-form.component.html',
  styleUrls: ['./code-form.component.css']
})
export class CodeFormComponent implements OnInit {

  form: FormGroup;

  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<BookFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CodeDto,
  ) {
    this.form = this.fb.group({
      id: [data.id],
      addDate: [data.addDate],
      addWho: [data.addWho],
      dictCode: [data.dictCode, [Validators.required]],
      itemCode: [data.itemCode, [Validators.required]],
      seqNo: [data.seqNo, [Validators.min(1)]],
      description: [data.description],
      value1: [data.value1],
      value2: [data.value2],
      value3: [data.value3],
      value4: [data.value4],
    })
  }

  ngOnInit(): void {
  }


  onCancel(): void {
    this.form.reset();
    this.dialogRef.close(false);
  }


  errorHandling(control: string, error: string) {
    return this.form.controls[control].hasError(error);
  }

  onSubmit() {
    this.dialogRef.close(this.form.value);
  }

}
