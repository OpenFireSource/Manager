import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumableCreateComponent } from './consumable-create.component';

describe('ConsumableCreateComponent', () => {
  let component: ConsumableCreateComponent;
  let fixture: ComponentFixture<ConsumableCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumableCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumableCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
