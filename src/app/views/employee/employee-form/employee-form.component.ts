import { EmployeeDto } from './../../../models/employee-dto';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CodeService } from 'src/app/services/code.service';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {

  form: FormGroup;
  idTypeOption: any;
  countryOption: any;
  genderOption: any;
  privilegesOption: any;
  statusOption: any;
  staffRoleOption: any;

  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<EmployeeFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EmployeeDto,
    private codeService: CodeService,
  ) {
    this.form = this.fb.group({
      id: [data.id],
      addDate: [data.addDate],
      addWho: [data.addWho],
      downloadURL: [data.downloadURL],
      imageKitURL: [data.imageKitURL],
      fullName: [data.fullName, [Validators.required]],
      idType: [data.idType, [Validators.required]],
      idNumber: [data.idNumber, [Validators.required]],
      username: [data.username, [Validators.required]],
      gender: [data.gender.toLowerCase(), [Validators.required]],
      address: [data.address, [Validators.required]],
      contactNo: [data.contactNo, [Validators.required]],
      email: [data.email, [Validators.required, Validators.email]],
      salary: [data.salary, [Validators.min(0), Validators.max(9999999)]],
      status: [data.status],
      role: [data.role, [Validators.required]],
      loginProfile: [false],
    })
  }

  ngOnInit(): void {
    this.codeService.getByCode('general', 'gender').subscribe((item) => {
      this.genderOption = item.map(x => ({ label: x.value1, value: x.value1.toLowerCase() }));
    });
    this.codeService.getByCode('staff_role', 'role').subscribe((item) => {
      this.staffRoleOption = item.map(x => ({ label: x.value1, value: x.value1 }));
    });
    this.codeService.getByCode('staff_role', 'idType').subscribe((item) => {
      this.idTypeOption = item.map(x => ({ label: x.value1, value: x.value1 }));
    });
    this.codeService.getByCode('staff_role', 'status').subscribe((item) => {
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
