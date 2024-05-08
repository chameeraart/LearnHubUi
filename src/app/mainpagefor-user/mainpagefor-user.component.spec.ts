import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainpageforUserComponent } from './mainpagefor-user.component';

describe('MainpageforUserComponent', () => {
  let component: MainpageforUserComponent;
  let fixture: ComponentFixture<MainpageforUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainpageforUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainpageforUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
