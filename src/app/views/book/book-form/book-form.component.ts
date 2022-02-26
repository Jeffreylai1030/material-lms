import { BookDto } from './../../../models/book-dto';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatChipInputEvent } from '@angular/material/chips';
import { CodeService } from 'src/app/services/code.service';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit {

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  form: FormGroup;
  languageOption: any;
  categoriesOption: any;
  statusOption: any;

  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<BookFormComponent>,
    private codeService: CodeService,
    @Inject(MAT_DIALOG_DATA) public data: BookDto,
  ) {
    this.form = this.fb.group({
      id: [data.id],
      addDate: [data.addDate],
      addWho: [data.addWho],
      title: [data.title, [Validators.required]],
      title2: [data.title2],
      isbn: [data.isbn, [Validators.required]],
      pageCount: [data.pageCount, [Validators.min(0), Validators.max(999999)]],
      publishedDate: [data.publishedDate?.toDate()],
      publisher: [data.publisher],
      thumbnailUrl: [data.thumbnailUrl],
      authors: [data.authors],
      language: [data.language],
      status: [data.status],
      categories: [data.categories],
      tags: [data.tags],
    })
  }

  ngOnInit(): void {
    this.codeService.getByCode('book', 'language').subscribe((item) => {
      this.languageOption = item.map(x => ({ label: x.value1, value: x.value1 }));
    });
    this.codeService.getByCode('book', 'category').subscribe((item) => {
      this.categoriesOption = item.map(x => ({ label: x.value1, value: x.value1 }));
    });
    this.codeService.getByCode('book', 'status').subscribe((item) => {
      this.statusOption = item.map(x => ({ label: x.value1, value: x.value2 }));
    });
  }

  add(values: any, event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      values.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(values: any, selected: any): void {
    const index = values.indexOf(selected);

    if (index >= 0) {
      values.splice(index, 1);
    }
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
