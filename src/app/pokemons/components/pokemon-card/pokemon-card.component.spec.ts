import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PokemonCardComponent } from './pokemon-card.component';
import { provideRouter } from '@angular/router';
import { SimplePokemon } from '../../interfaces';

const pokemonMock: SimplePokemon = {
  id: '1',
  name: 'bulbasaure',
};

describe('PokemonCardComponent', () => {
  let fixture: ComponentFixture<PokemonCardComponent>;
  let component: PokemonCardComponent;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonCardComponent],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonCardComponent);
    fixture.componentRef.setInput('pokemon', pokemonMock);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have the SimplePokemon ignal inputValue', () => {
    expect(component.pokemon()).toEqual(pokemonMock);
  });

  it('should render the pokemon name and image correctly', () => {
    expect(compiled.querySelector('h2')?.textContent?.trim()).toBe(
      pokemonMock.name
    );

    const image = compiled.querySelector('img')!;
    expect(image).toBeDefined();

    expect(image.src).toBe(
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonMock.id}.png`
    );
  });

  // it('should have the proper ng-reflect-router-link', () => {
  //   const div = compiled.querySelector('div');
  //   console.log(div);
  //   expect(div?.attributes.getNamedItem('ng-reflect-router-link')?.value).toBe(
  //     '/pokemons,' + pokemonMock.name
  //   );
  // });
});
