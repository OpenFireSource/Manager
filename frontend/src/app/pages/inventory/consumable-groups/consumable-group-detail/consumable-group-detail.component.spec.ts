import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumableGroupDetailComponent } from './consumable-group-detail.component';

describe('ConsumableGroupDetailComponent', () => {
  let component: ConsumableGroupDetailComponent;
  let fixture: ComponentFixture<ConsumableGroupDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumableGroupDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumableGroupDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
