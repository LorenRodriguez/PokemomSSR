import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PokemonService } from './pokemon.service';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Pokemon, PokemonAPIResponse, SimplePokemon } from '../interfaces';
import { catchError } from 'rxjs';

const pokeResponseApiMock: PokemonAPIResponse = {
  count: 1302,
  next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
  results: [
    {
      name: 'bulbasaur',
      url: 'https://pokeapi.co/api/v2/pokemon/1/',
    },
    {
      name: 'ivysaur',
      url: 'https://pokeapi.co/api/v2/pokemon/2/',
    },
  ],
  previous: null,
};

const expectedPokemonsMock: SimplePokemon[] = [
  {
    id: '1',
    name: 'bulbasaur',
  },
  {
    id: '2',
    name: 'ivysaur',
  },
];

const pokemonMock = {
  id: '1',
  name: 'bulbasaur',
} as unknown as Pokemon;

describe('PokemonService', () => {
  let service: PokemonService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(PokemonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should a load page of SimplePokemons', () => {
    service.loadPage(1).subscribe((pokemons) => {
      expect(pokemons).toEqual(expectedPokemonsMock);
    });

    const req = httpMock.expectOne(
      `https://pokeapi.co/api/v2/pokemon?offset=0&limit=20`
    );

    expect(req.request.method).toBe('GET');

    req.flush(pokeResponseApiMock);
  });

  it('should a load page 5 of SimplePokemons', () => {
    service.loadPage(5).subscribe((pokemons) => {
      expect(pokemons).toEqual(expectedPokemonsMock);
    });

    const req = httpMock.expectOne(
      `https://pokeapi.co/api/v2/pokemon?offset=80&limit=20`
    );

    expect(req.request.method).toBe('GET');

    req.flush(pokeResponseApiMock);
  });

  it('should a load Pokemon by id', () => {
    service.getPokemon(pokemonMock.id.toString()).subscribe((pokemon) => {
      expect(pokemon).toEqual(pokemonMock);
    });

    const req = httpMock.expectOne(
      `https://pokeapi.co/api/v2/pokemon/${pokemonMock.id}`
    );

    expect(req.request.method).toBe('GET');

    req.flush(pokemonMock);
  });

  it('should a load Pokemon by name', () => {
    service.getPokemon(pokemonMock.name).subscribe((pokemon) => {
      expect(pokemon).toEqual(pokemonMock);
    });

    const req = httpMock.expectOne(
      `https://pokeapi.co/api/v2/pokemon/${pokemonMock.name}`
    );

    expect(req.request.method).toBe('GET');

    req.flush(pokemonMock);
  });

  it('should  catch error if pokemon not found', () => {
    const pokemonName = 'notExist';

    service
      .getPokemon(pokemonName)
      .pipe(
        catchError((err) => {
          expect(err.message).toContain('Pokemon not found');
          return [];
        })
      )
      .subscribe();

    const req = httpMock.expectOne(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );

    expect(req.request.method).toBe('GET');

    req.flush('Pokemon not found', { status: 404, statusText: 'Not Found' });
  });
});
