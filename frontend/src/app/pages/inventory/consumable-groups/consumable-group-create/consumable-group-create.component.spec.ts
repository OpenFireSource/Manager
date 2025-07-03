import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumableGroupCreateComponent } from './consumable-group-create.component';

describe('ConsumableGroupCreateComponent', () => {
  let component: ConsumableGroupCreateComponent;
  let fixture: ComponentFixture<ConsumableGroupCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumableGroupCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumableGroupCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
