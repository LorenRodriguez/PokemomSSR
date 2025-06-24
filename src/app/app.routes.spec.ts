import { TestBed } from '@angular/core/testing';
import { routes } from './app.routes';
import { Location } from '@angular/common';
import { provideRouter, Router } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';

describe('App Routes', () => {
  let router: Router;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter(routes)],
    });

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should navigate to about redirect to abaout', async () => {
    await router.navigate(['about']);

    expect(location.path()).toBe('/about');
  });

  it('should navigate to pokemons/page/1 ', async () => {
    await router.navigate(['/pokemons/page/1']);

    expect(location.path()).toBe('/pokemons/page/1');
  });

  it('should navigate to about if no exist page', async () => {
    await router.navigate(['/unknow-page']);

    expect(location.path()).toBe('/about');
  });

  it('should load the porper component', async () => {
    const abouteRoute = routes.find((route) => route.path === 'about')!;
    expect(abouteRoute).toBeDefined();

    const aboutComponent = (await abouteRoute.loadComponent!()) as any;

    expect(aboutComponent.default.name).toContain('AboutPageComponent');

    const pokemonsPageRoute = routes.find(
      (route) => route.path === 'pokemons/page/:page'
    )!;
    expect(pokemonsPageRoute).toBeDefined();

    const pokemonsPageComponent =
      (await pokemonsPageRoute.loadComponent!()) as any;

    expect(pokemonsPageComponent.default.name).toContain(
      'PokemonsPageComponent'
    );
  });

  it('should create component pokemon-page when navigate pokemon/granija', async () => {
    // expect(valorActual).toBe(valorEsperado);
  });
});
