import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceTypeDetailComponent } from './device-type-detail.component';

describe('DeviceTypeDetailComponent', () => {
  let component: DeviceTypeDetailComponent;
  let fixture: ComponentFixture<DeviceTypeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceTypeDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceTypeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
