import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideRouter } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@Component({
  selector: 'app-navbar',
})
class NavbarComponentMock {}

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let app: App;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    })
      .overrideComponent(App, {
        add: { imports: [NavbarComponentMock] },
        remove: {
          imports: [NavbarComponent],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(App);
    app = fixture.componentInstance;

    compiled = fixture.nativeElement;

    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should render the navbar and router outlet', () => {
    expect(compiled.querySelector('app-navbar')).toBeTruthy();
    expect(compiled.querySelector('router-outlet')).not.toBeNull();
  });
});
