import { EmployeeService } from 'src/app/services/employee.service';
import { EmployeeDto } from '../models/employee-dto';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private auth: Auth,
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  authState() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // User is signed in
        const email = user?.email?.toLowerCase() || '';
        this.employeeService
          .getByEmail(email)
          .subscribe((x: EmployeeDto[]) => {
            localStorage.setItem('lms_emp', JSON.stringify({
                email: user.email,
                username: x[0].username,
                fullName: x[0].fullName,
                downloadURL: x[0].downloadURL,
              })
            );
          });
      } else {
        // User not signed in
        this.router.navigate(['login']);
      }
    })
  }

  login(email: string, password: string) {
    signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Signed in
        this.employeeService
          .getByEmail(email.toLowerCase())
          .subscribe((x: EmployeeDto[]) => {
            localStorage.setItem('lms_emp', JSON.stringify({
                email,
                username: x[0].username,
                fullName: x[0].fullName,
                downloadURL: x[0].downloadURL,
              })
            );
            this.router.navigate(['main']);
          });
      })
      .catch((e) => {
        alert(e.message);
      });
  }

  logout() {
    localStorage.removeItem('lms_emp');
    signOut(this.auth);
    this.router.navigate(['login']);
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email.toLowerCase(), password);
  }
}
