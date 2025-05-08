import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceGroupCreateComponent } from './device-group-create.component';

describe('DeviceGroupCreateComponent', () => {
  let component: DeviceGroupCreateComponent;
  let fixture: ComponentFixture<DeviceGroupCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceGroupCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceGroupCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
