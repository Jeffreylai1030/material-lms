import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = this.fb.group({});
  defaultAccount = {
    email: 'Jeffreylai1030@gmail.com',
    password: '1q2w3e4r5t',
  };

  constructor(
    private fb: FormBuilder,
    private loginService: AuthService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: [
        this.defaultAccount.email,
        [Validators.required, Validators.email],
      ],
      password: [
        this.defaultAccount.password,
        [Validators.required, Validators.minLength(8)],
      ],
    });
  }

  login() {
    this.loginService.login(
      this.loginForm.value.email,
      this.loginForm.value.password
    );
  }

  errorHandling(control: string, error: string) {
    return this.loginForm.controls[control].hasError(error);
  }
}
