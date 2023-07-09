import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SmallWidgetComponent } from './small-widget.component';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';

describe('SmallWidgetComponent', () => {
  let component: SmallWidgetComponent;
  let fixture: ComponentFixture<SmallWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        TranslateModule.forRoot()
      ],
      declarations: [ SmallWidgetComponent ],

    })
    .compileComponents();

    fixture = TestBed.createComponent(SmallWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
