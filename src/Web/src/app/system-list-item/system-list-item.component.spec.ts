import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemListItemComponent } from './system-list-item.component';

describe('SystemListItemComponent', () => {
  let component: SystemListItemComponent;
  let fixture: ComponentFixture<SystemListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
