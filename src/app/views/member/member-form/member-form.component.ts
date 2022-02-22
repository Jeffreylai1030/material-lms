import { CodeService } from 'src/app/services/code.service';
import { MemberDto } from './../../../models/member-dto';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BookFormComponent } from '../../book/book-form/book-form.component';

@Component({
  selector: 'app-member-form',
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.css']
})
export class MemberFormComponent implements OnInit {

  form: FormGroup;
  idTypeOption: any;
  countryOption: any;
  genderOption: any;
  privilegesOption: any;
  statusOption: any;

  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<BookFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MemberDto,
    private codeService: CodeService
  ) {
    this.form = this.fb.group({
      id: [data.id],
      addDate: [data.addDate],
      addWho: [data.addWho],
      borrowed: [data.borrowed],
      totalBorrowed: [data.totalBorrowed],
      fullName: [data.fullName, [Validators.required]],
      idType: [data.idType, [Validators.required]],
      idNumber: [data.idNumber, [Validators.min(1)]],
      issueCountry: [data.issueCountry, [Validators.required]],
      gender: [data.gender, [Validators.required]],
      address: [data.address, [Validators.required]],
      contactNo: [data.contactNo, [Validators.required]],
      email: [data.email, [Validators.required, Validators.email]],
      effDate: [data.effDate?.toDate(), [Validators.required]],
      expDate: [data.expDate?.toDate(), [Validators.required]],
      privilege: [data.privilege, [Validators.required]],
      status: [data.status],
    })
  }

  ngOnInit(): void {
    this.codeService.getByCode('member', 'idType').subscribe((item) => {
      this.idTypeOption = item.map(x => ({ label: x.value1, value: x.value1 }));
    });
    this.codeService.getByCode('member', 'gender').subscribe((item) => {
      this.genderOption = item.map(x => ({ label: x.value1, value: x.value1 }));
    });
    this.codeService.getCountries().subscribe((item: any) => {
      this.countryOption = item.map((x: any) => ({ label: x.name.common, value: x.name.common }));
    });
    this.codeService.getByCode('member', 'privileges').subscribe((item) => {
      this.privilegesOption = item.map(x => ({ label: x.value1, value: x.value1 }));
    });
    this.codeService.getByCode('member', 'status').subscribe((item) => {
      this.statusOption = item.map(x => ({ label: x.value1, value: x.value2 }));
    });
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
