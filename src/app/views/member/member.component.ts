import { DialogComponent } from './../layout/dialog/dialog.component';
import { MemberDto } from './../../models/member-dto';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  DynamicDatePickerModel,
  DynamicFormModel,
  DynamicInputModel,
  DynamicSelectModel,
} from '@ng-dynamic-forms/core';
import { CodeService } from 'src/app/services/code.service';
import { MemberService } from 'src/app/services/member.service';
import { FormComponent } from '../layout/form/form.component';
import { CodeDto } from 'src/app/models/code-dto';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css'],
})
export class MemberComponent implements OnInit {
  displayedColumns = [
    'fullName',
    'email',
    'gender',
    'contactNo',
    'borrowed',
    'effDate',
    'expDate',
    'status',
    'action',
  ];
  dataSource!: MatTableDataSource<MemberDto>;
  title = '';
  count = 0;
  statusCode: CodeDto[] = [];
  privilegesOption: any;
  statusOption: any;
  idTypeOption: any;
  countryOption: any;

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  constructor(
    private memberService: MemberService,
    private codeService: CodeService,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.memberService.get().subscribe((item) => {
      this.dataSource = new MatTableDataSource(item);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.count = item.length;
    });

    this.codeService.getByCode('member', 'privileges').subscribe((item) => {
      this.privilegesOption = item.map(x => ({ label: x.value1, value: x.value1 }));
    });
    this.codeService.getByCode('member', 'status').subscribe((item) => {
      this.statusCode = item;
      this.statusOption = item.map(x => ({ label: x.value1, value: x.value2 }));
    });
    this.codeService.getByCode('member', 'idType').subscribe((item) => {
      this.idTypeOption = item.map(x => ({ label: x.value1, value: x.value1 }));
    });
    this.codeService.getCountries().subscribe((item: any) => {
      this.countryOption = item.map((x: any) => ({ label: x.name.common, value: x.name.common }));
    });
  }

  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue.target.value.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(memberDto: MemberDto = new MemberDto()) {
    const formModel: DynamicFormModel = [
      new DynamicInputModel({
        id: 'id',
        label: 'id',
        value: memberDto.id,
        hidden: true,
      }),
      new DynamicInputModel({
        id: 'addDate',
        label: 'addDate',
        value: memberDto.addDate,
        hidden: true,
      }),
      new DynamicInputModel({
        id: 'addWho',
        label: 'addWho',
        value: memberDto.addWho,
        hidden: true,
      }),
      new DynamicInputModel({
        id: 'borrowed',
        label: 'borrowed',
        value: memberDto.borrowed,
        hidden: true,
      }),
      new DynamicInputModel({
        id: 'totalBorrowed',
        label: 'totalBorrowed',
        value: memberDto.totalBorrowed,
        hidden: true,
      }),
      new DynamicInputModel({
        id: 'fullName',
        label: 'Name',
        value: memberDto.fullName,
        validators: {
          required: null,
        },
        errorMessages: {
          required: '{{ label }} is required',
        },
      }),
      new DynamicSelectModel({
        id: 'idType',
        label: 'ID Type',
        value: memberDto.idType,
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
        value: memberDto.idNumber,
        validators: {
          required: null,
        },
        errorMessages: {
          required: '{{ label }} is required',
        },
      }),
      new DynamicSelectModel({
        id: 'issueCountry',
        label: 'Issue Country',
        value: memberDto.issueCountry,
        options: this.countryOption,
        validators: {
          required: null,
        },
        errorMessages: {
          required: '{{ label }} is required',
        },
      }),
      new DynamicSelectModel({
        id: 'gender',
        label: 'Gender',
        value: memberDto.gender,
        options: [
          { label: 'Male', value: 'Male' },
          { label: 'Female', value: 'Female' },
        ],
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
        value: memberDto.address,
        validators: {
          required: null,
        },
        errorMessages: {
          required: '{{ label }} is required',
        },
      }),
      new DynamicInputModel({
        id: 'contactNo',
        label: 'Contact Number',
        value: memberDto.contactNo,
        placeholder: 'XXX-XXXXXXX',
        validators: {
          required: null,
          pattern: '^[0-9]{2,3}-[0-9]{7,9}$',
        },
        errorMessages: {
          required: '{{ label }} is required',
          pattern: 'Please follow the format XXX-XXXXXXX',
        },
      }),
      new DynamicInputModel({
        id: 'email',
        label: 'Email Address',
        value: memberDto.email,
        inputType: 'email',
        validators: {
          required: null,
          pattern: '^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$',
        },
        errorMessages: {
          required: '{{ label }} is required',
          pattern: 'Invalid {{ label }}',
        },
      }),
      new DynamicDatePickerModel({
        id: 'effDate',
        label: 'Effective Date',
        format: 'dd/mm/yyyy',
        value: memberDto.effDate?.toDate(),
        validators: {
          required: null,
        },
        errorMessages: {
          required: '{{ label }} is required',
        },
      }),
      new DynamicDatePickerModel({
        id: 'expDate',
        label: 'Expired Date',
        format: 'dd/mm/yyyy',
        value: memberDto.expDate?.toDate(),
        validators: {
          required: null,
        },
        errorMessages: {
          required: '{{ label }} is required',
        },
      }),
      new DynamicSelectModel({
        id: 'privilege',
        label: 'Loan Privilege Level',
        value: memberDto.privilege,
        options: this.privilegesOption,
        validators: {
          required: null
        },
        errorMessages: {
          required: '{{ label }} is required'
        }
      }),
      new DynamicSelectModel({
        id: 'status',
        label: 'Status',
        value: memberDto.status,
        options: this.statusOption,
        validators: {
          required: null
        },
        errorMessages: {
          required: '{{ label }} is required'
        }
      }),
    ];

    this.title = memberDto.email ? 'Update Member Information' : 'New Member Information';

    const dialogRef = this.dialog.open(FormComponent, {
      width: '450px',
      panelClass: 'confirm-dialog-container',
      data: { title: this.title, formModel },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onSubmit(result);
      }
    });
  }

  onSubmit(member: MemberDto) {
    // const memberDto = new MemberDto(
    //   member.id,
    //   member.addDate,
    //   '',
    //   member.editDate,
    //   '',
    //   member.address,
    //   member.contactNo,
    //   member.email,
    //   member.fullName,
    //   member.gender,
    //   member.borrowed,
    //   member.totalBorrowed,
    //   member.status,
    //   member.effDate,
    //   member.expDate,
    //   member.privilege,
    //   member.idNumber,
    //   member.idType,
    //   member.issueCountry);

    this.memberService.set(member);
  }

  onStatusToggle(memberDto: MemberDto) {
    const newStatus = memberDto.status === '1' || memberDto.status === '0' ? '9' : '0';
    const newStatusName = this.statusCode.find(x => x.value2 === newStatus)?.value1.toLowerCase();

    const dialogRef = this.dialog.open(DialogComponent, {
      width: '350px',
      panelClass: 'confirm-dialog-container',
      data: {
        title: 'Confirmation',
        content: `Do you want to ${newStatusName} this member?`,
        btnType: 'form',
        theme: 'dialog-red'
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        memberDto.status = newStatus;
        this.memberService.set(memberDto);
      }
    });
  }

  onDelete(id: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '350px',
      panelClass: 'confirm-dialog-container',
      data: {
        title: 'Confirmation',
        content: 'Do you want to remove this members, it is recommend to deactive the member?',
        btnType: 'form',
        theme: 'dialog-red',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.memberService.delete(id);
      }
    });
  }

  insertSampleMembers() {
    this.memberService.insertSampleMembers();
  }
}
