import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceGroupsComponent } from './device-groups.component';

describe('DeviceGroupsComponent', () => {
  let component: DeviceGroupsComponent;
  let fixture: ComponentFixture<DeviceGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceGroupsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
