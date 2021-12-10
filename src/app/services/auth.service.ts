import { EmployeeService } from 'src/app/services/employee.service';
import { EmployeeDto } from '../models/employee-dto';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private firestore: Firestore,
    private auth: Auth,
    private router: Router,
    private employeeService: EmployeeService) { }

  authState() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // User is signed in
        console.log('user is signed in');
        const storageUser: any = localStorage.getItem('lms_emp');
        if (storageUser.email !== user.email) {
          this.logout();
        }
      } else {
        // User is signed out
        console.log('user is signed out');
      }
    });
  }

  login(email: string, password: string) {
    try {
      signInWithEmailAndPassword(this.auth, email, password).then(userCredential => {
        // Signed in
        this.employeeService.getByEmail(email.toLowerCase()).subscribe((x: EmployeeDto[]) => {
          localStorage.setItem('lms_emp', JSON.stringify({ email, username: x[0].username }))
          this.router.navigate(['main']);
        });
      }).catch((e) => {
        alert(e.message);
      });
    } catch (e: any) {
      alert(e.message);
    }
  }

  logout() {
    localStorage.removeItem('lms_emp');
    signOut(this.auth);
    this.router.navigate(['login']);
  }

  register(email: string, password: string) {
    try {
      createUserWithEmailAndPassword(this.auth, email.toLowerCase(), password);
      return 'Register Successful';
    } catch (e: any) {
      alert(e.message);
      return e.message;
    }
  }
}
