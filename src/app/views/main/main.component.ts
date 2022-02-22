import { AuthService } from 'src/app/services/auth.service';
import { Component, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnDestroy {
  mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private auth: AuthService,
    public translate: TranslateService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 990px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);

    const language = localStorage.getItem('lms_language');

    if (language) {
      this.translate.use(language);
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
