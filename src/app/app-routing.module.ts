import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookComponent } from './views/book/book.component';
import { BorrowComponent } from './views/borrow/borrow.component';
import { CodeComponent } from './views/code/code.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { EmployeeComponent } from './views/employee/employee.component';
import { LoginComponent } from './views/login/login.component';
import { MainComponent } from './views/main/main.component';
import { MemberComponent } from './views/member/member.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  {
    path: 'main',
    component: MainComponent,
    children: [
      // { path: '', redirectTo: 'book', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'book', component: BookComponent },
      // { path: 'book/:id', component: BookComponent },
      { path: 'employee', component: EmployeeComponent },
      { path: 'code', component: CodeComponent },
      { path: 'member', component: MemberComponent },
      { path: 'borrow', component: BorrowComponent },
    ],
  },
  { path: '**', pathMatch: 'full', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
