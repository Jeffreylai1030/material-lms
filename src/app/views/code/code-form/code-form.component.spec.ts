import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeFormComponent } from './code-form.component';

describe('CodeFormComponent', () => {
  let component: CodeFormComponent;
  let fixture: ComponentFixture<CodeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodeFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
