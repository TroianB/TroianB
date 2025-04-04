import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InnerblogComponent } from './innerblog.component';

describe('InnerblogComponent', () => {
  let component: InnerblogComponent;
  let fixture: ComponentFixture<InnerblogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InnerblogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InnerblogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
