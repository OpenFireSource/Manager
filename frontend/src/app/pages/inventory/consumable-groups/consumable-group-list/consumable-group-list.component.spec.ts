import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumableGroupListComponent } from './consumable-group-list.component';

describe('ConsumableGroupListComponent', () => {
  let component: ConsumableGroupListComponent;
  let fixture: ComponentFixture<ConsumableGroupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumableGroupListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumableGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
