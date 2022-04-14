import { AuthService } from 'src/app/services/auth.service';
import { Component, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnDestroy, OnInit {
  mobileQuery: MediaQueryList;
  loginUser: any;
  transformation = [{
    height: '40',
    width: '40',
    focus: 'auto',
    radius: 'max'
  }];
  lqip = { active: true, quality: 1 };

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public media: MediaMatcher,
    private auth: AuthService,
    private commonService: CommonService,
    private translate: TranslateService
    ) {
      this.mobileQuery = media.matchMedia('(max-width: 990px)');
      this.mobileQueryListener = () => changeDetectorRef.detectChanges();
      this.mobileQuery.addEventListener('change', this.mobileQueryListener);

      const language = localStorage.getItem('lms_language');

      if (language) {
        this.translate.use(language);
      }
    }

  private mobileQueryListener: () => void;

  ngOnInit(): void {
    this.loginUser = this.commonService.getCurrentUser();

    if (Object.keys(this.loginUser).length === 0) {
      this.onLogout();
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);
  }

  onLogout() {
    this.auth.logout();
  }

  onChangeLanguage(language: string) {
    localStorage.setItem('lms_language', language)
    this.translate.use(language);
  }
}
