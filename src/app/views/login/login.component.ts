import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '@services/auth.service';

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
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    public translate: TranslateService,
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
    ).subscribe(x => {
      console.error(x);
      if (x.code === 'auth/wrong-password') {
        this.errorMsg = this.translate.instant('errorMsg.wrong-password');
      }
    })
  }

  errorHandling(control: string, error: string) {
    return this.loginForm.controls[control].hasError(error);
  }
}
