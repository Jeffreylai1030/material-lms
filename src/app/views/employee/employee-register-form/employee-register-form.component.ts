import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-employee-register-form',
  templateUrl: './employee-register-form.component.html',
  styleUrls: ['./employee-register-form.component.css']
})
export class EmployeeRegisterFormComponent implements OnInit {

  form: FormGroup;

  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<EmployeeRegisterFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.form = this.fb.group({
      email: [data.email],
      password: [data.password, [Validators.required]],
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
