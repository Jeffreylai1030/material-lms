import { EmployeeDto } from './../../models/employee-dto';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DynamicFormModel, DynamicInputModel, DynamicRadioGroupModel, DynamicSelectModel, DynamicSwitchModel } from '@ng-dynamic-forms/core';
import { CodeService } from 'src/app/services/code.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { DialogComponent } from '../layout/dialog/dialog.component';
import { FormComponent } from '../layout/form/form.component';
import { AuthService } from 'src/app/services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  displayedColumns = [
    '#',
    'fullName',
    'username',
    'gender',
    'email',
    'contactNo',
    'role',
    'salary',
    'status',
    'action'
  ];
  dataSource!: MatTableDataSource<EmployeeDto>;
  title = '';
  staffRoleOption: any = [];
  idTypeOption: any = []
  statusOption: any = []

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  selectedEmployee: EmployeeDto = new EmployeeDto();

  constructor(
    private employeeService: EmployeeService,
    private loginService: AuthService,
    public codeService: CodeService,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private datepipe: DatePipe,
  ) {}

  ngOnInit() {
    this.employeeService.get().subscribe((item: EmployeeDto[]) => {
      this.dataSource = new MatTableDataSource(item);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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

  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue.target.value.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(emp: EmployeeDto = new EmployeeDto()) {
    const formModel: DynamicFormModel = [
      new DynamicInputModel({
        id: 'id',
        label: 'id',
        value: emp.id,
        hidden: true
      }),
      new DynamicInputModel({
        id: 'addDate',
        label: 'addDate',
        value: emp.addDate,
        hidden: true
      }),
      new DynamicInputModel({
        id: 'addWho',
        label: 'addWho',
        value: emp.addWho,
        hidden: true
      }),
      new DynamicInputModel({
        id: 'downloadURL',
        label: 'downloadURL',
        value: emp.downloadURL,
        hidden: true
      }),
      new DynamicInputModel({
        id: 'status',
        label: 'status',
        value: emp.status,
        hidden: true
      }),
      new DynamicInputModel({
        id: 'fullName',
        label: 'Full Name',
        value: emp.fullName,
        validators: {
          required: null
        },
        errorMessages: {
          required: '{{ label }} is required'
        }
      }),
      new DynamicInputModel({
        id: 'username',
        label: 'Username',
        value: emp.username,
        validators: {
          required: null
        },
        errorMessages: {
          required: '{{ label }} is required'
        }
      }),
      new DynamicSelectModel({
        id: 'gender',
        label: 'Gender',
        value: emp.gender,
        options: [{ label: 'Male', value: 'M' }, { label: 'Female', value: 'F' }],
        validators: {
          required: null
        },
        errorMessages: {
          required: '{{ label }} is required'
        }
      }),
      new DynamicSelectModel({
        id: 'idType',
        label: 'ID Type',
        value: emp.idType,
        options: this.idTypeOption,
        validators: {
          required: null,
        },
        errorMessages: {
          required: '{{ label }} is required',
        },
      }),
      new DynamicInputModel({
        id: 'idNumber',
        label: 'ID Number',
        value: emp.idNumber,
        validators: {
          required: null,
        },
        errorMessages: {
          required: '{{ label }} is required',
        },
      }),
      new DynamicInputModel({
        id: 'address',
        label: 'Address',
        value: emp.address,
        validators: {
          required: null
        },
        errorMessages: {
          required: '{{ label }} is required'
        }
      }),
      new DynamicInputModel({
        id: 'contactNo',
        label: 'ContactNo',
        value: emp.contactNo,
        validators: {
          required: null,
          pattern: '^[0-9]{2,3}-[0-9]{7,9}$'
        },
        errorMessages: {
          required: '{{ label }} is required',
          pattern: 'Invalid {{ label }}. Example: xxx-xxxxxxx'
        }
      }),
      new DynamicInputModel({
        id: 'email',
        label: 'Email Address',
        value: emp.email,
        inputType: 'email',
        validators: {
          required: null,
          pattern: '^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'
        },
        errorMessages: {
          required: '{{ label }} is required',
          pattern: 'Invalid {{ label }}. Example: jane.dose@example.com'
        }
      }),
      // new DynamicInputModel({
      //   id: 'profileImage',
      //   label: 'Profile Image',
      //   value: emp.profileImage,
      //   inputType: 'file',
      //   accept: 'image/*',
      // }),
      new DynamicInputModel({
        id: 'salary',
        label: 'Salary',
        inputType: 'number',
        value: emp.salary,
        validators: {
          required: null,
          min: 0,
          max: 99999999
        },
        errorMessages: {
          required: '{{ label }} is required',
          min: '{{ label }} cannot be negative number.',
          max: '{{ label }} number too larger.'
        }
      }),
      new DynamicSelectModel({
        id: 'role',
        label: 'Role',
        value: emp.role,
        options: this.staffRoleOption,
        validators: {
          required: null
        },
        errorMessages: {
          required: '{{ label }} is required'
        }
      }),
      new DynamicRadioGroupModel({
        id: 'status',
        legend: "Status",
        value: emp.status,
        options: this.statusOption
      }),
      new DynamicSwitchModel({
        id: 'loginProfile',
        label: 'Create login account',
        value: emp.loginProfile,
        onLabel: 'Yes',
        offLabel: 'No'
      }),
    ];

    this.title = emp.email ? 'Update Employee Information' : 'New Employee Information';

    const dialogRef = this.dialog.open(FormComponent, {
      width: '450px',
      panelClass: 'confirm-dialog-container',
      data: { title: this.title, formModel }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onSubmit(result);
      }
    });
  }

  onUpload(emp: EmployeeDto) {
    this.selectedEmployee = emp;
    document.getElementById('uploader')?.click();
  }

  onUploaderChange(event: any) {
    try {
      if (event.target.files[0].size < 5 * 1024 * 1024) {
        this.selectedEmployee.profileImage = event.target.files[0]; // Need BLOB
        this.employeeService.uploadProfilePicture(this.selectedEmployee);
      } else {
        this.dialog.open(DialogComponent, {
          width: '350px',
          panelClass: 'confirm-dialog-container',
          data: {
            title: 'Registration',
            html: 'Image cannot larger than 5 MB',
            theme: 'dialog-red'
          }
        });
      }
    } catch (error) {
      console.warn("File upload failed.");
    }
  }

  onRegister(email: string, password = '') {
    const formModel: DynamicFormModel = [
      new DynamicInputModel({
        id: 'email',
        label: 'Email',
        value: email,
        inputType: 'email',
        validators: {
          required: null
        },
        errorMessages: {
          required: '{{ label }} is required'
        }
      }),
      new DynamicInputModel({
        id: 'password',
        label: 'Password',
        value: password,
        inputType: 'password',
        validators: {
          required: null
        },
        errorMessages: {
          required: '{{ label }} is required'
        }
      })
    ];

    const dialogRef = this.dialog.open(FormComponent, {
      width: '450px',
      panelClass: 'confirm-dialog-container',
      data: { title: 'Reset Password / Register', formModel }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        const msg = await this.loginService.register(result.email, result.password);
        this.dialog.open(DialogComponent, {
          width: '350px',
          panelClass: 'confirm-dialog-container',
          data: {
            title: 'Registration',
            html: msg,
            theme: `${msg === 'Register Successful' ? 'dialog-blue' : 'dialog-red'}`
          }
        });
      }
    });
  }

  onShowAllData(emp: EmployeeDto) {
    const addDate = new Date(emp.addDate.seconds * 1000);
    const editDate = new Date(emp.editDate.seconds * 1000);
    const html = `<table style="width:100%">
                    <tr><td style="width: 6rem"><b>Name</b></td><td>${emp.fullName}</td></tr>
                    <tr><td><b>ID</b></td><td>${emp.id}</td></tr>
                    <tr><td><b>IC</b></td><td>${emp.idNumber}</td></tr>
                    <tr><td><b>Address</b></td><td>${emp.address}</td></tr>
                    <tr><td><b>AddDate</b></td><td>${this.datepipe.transform(addDate, 'yyyy-MM-dd HH:mm:ss')}</td></tr>
                    <tr><td><b>AddWho</b></td><td>${emp.addWho}</td></tr>
                    <tr><td><b>EditDate</b></td><td>${this.datepipe.transform(editDate, 'yyyy-MM-dd HH:mm:ss')}</td></tr>
                    <tr><td><b>EditWho</b></td><td>${emp.editWho}</td></tr>
                  </table>`;

    const safeHtml = this.sanitizer.bypassSecurityTrustHtml(html);
    this.dialog.open(DialogComponent, {
      width: '350px',
      panelClass: 'confirm-dialog-container',
      data: { title: 'Detail', html: safeHtml, theme: 'dialog-blue' }
    });
  }

  onSubmit(emp: EmployeeDto) {
    this.employeeService.set(emp);
  }

  onStatusToggle(id: string, status: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '350px',
      panelClass: 'confirm-dialog-container',
      data: {
        title: 'Confirmation',
        content: `Do you want to ${status === '1' ? 'deactivate' : 'activate'} this employee?`,
        btnType: 'form',
        theme: 'dialog-red'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.employeeService.toggleStatus(id, status);
      }
    });
  }

  onDelete(emp: EmployeeDto) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '350px',
      panelClass: 'confirm-dialog-container',
      data: {
        title: 'Confirmation',
        content: 'Do you want to delete this employee?',
        btnType: 'form',
        theme: 'dialog-red'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeeService.delete(emp);
      }
    });
  }

}
