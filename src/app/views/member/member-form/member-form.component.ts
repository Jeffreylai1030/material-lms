import { CodeService } from '@services/code.service';
import { MemberDto } from '@models/member-dto';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-member-form',
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.css'],
})
export class MemberFormComponent implements OnInit {
  form: FormGroup;
  idTypeOption: any;
  countryOption: any;
  genderOption: any;
  privilegesOption: any;
  statusOption: any;
  language = this.translate.currentLang;
  filterCtrl = new FormControl();
  filteredData: any;

  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<MemberFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MemberDto,
    private codeService: CodeService,
    public translate: TranslateService
  ) {
    this.form = this.fb.group({
      id: [data.id],
      addDate: [data.addDate],
      addWho: [data.addWho],
      borrowed: [data.borrowed],
      totalBorrowed: [data.totalBorrowed],
      fullName: [data.fullName, [Validators.required]],
      idType: [data.idType, [Validators.required]],
      idNumber: [data.idNumber, [Validators.required]],
      issueCountry: [data.issueCountry, [Validators.required]],
      gender: [data.gender, [Validators.required]],
      address: [data.address, [Validators.required]],
      contactNo: [data.contactNo, [Validators.required]],
      email: [data.email, [Validators.required, Validators.email]],
      effDate: [data.effDate?.toDate(), [Validators.required]],
      expDate: [data.expDate?.toDate(), [Validators.required]],
      privilege: [data.privilege, [Validators.required]],
      status: [data.status],
    });
  }

  ngOnInit(): void {
    this.codeService.getMemberIdTypes().subscribe((item) => {
      this.idTypeOption = item.map((x) => ({
        label: x.value1,
        value: x.value1,
      }));
    });
    this.codeService.getGenders().subscribe((item) => {
      this.genderOption = item.map((x) => ({
        label: x.value1,
        value: x.value1,
      }));
    });
    this.codeService.getCountries().subscribe((item: any) => {
      this.countryOption = item.map((x: any) => {
        if (this.language === 'en') {
          return {
            label: x.name.common,
            name: x.name.common,
            value: x.name.common,
            flag: x.flags.svg,
          };
        } else if (this.language === 'zh-CN') {
          if (x.translations?.zho?.common) {
            return {
              label: x.translations?.zho?.common,
              name: x.name.common,
              value: x.name.common,
              flag: x.flags.svg,
            };
          } else {
            return {
              label: x.name.nativeName?.zho?.common,
              name: x.name.common,
              value: x.name.common,
              flag: x.flags.svg,
            };
          }
        }
        return {};
      });
      this.filteredData = this.countryOption;
    });
    this.codeService.getMemberPrivileges().subscribe((item) => {
      this.privilegesOption = item.map((x) => ({
        label: x.value1,
        value: x.value1,
      }));
    });
    this.codeService.getMemberStatus().subscribe((item) => {
      this.statusOption = item.map((x) => ({
        label: x.value1,
        value: x.value2,
      }));
    });

    this.filterCtrl.valueChanges.pipe().subscribe(() => {
      const search = this.filterCtrl.value?.toLowerCase();
      this.filteredData = this.countryOption.filter(
        (item: any) => item.name.toLowerCase().indexOf(search) > -1
      );
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
