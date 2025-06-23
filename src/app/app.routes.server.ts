import { inject } from '@angular/core';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { PokemonService } from './pokemons/services/pokemon.service';
import { lastValueFrom } from 'rxjs';

const TOTAL_POKEMONS = 10;

const TOTAL_PAGES = 5;

export const serverRoutes: ServerRoute[] = [
  {
    path: 'pokemons/page/:page',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return Array.from({ length: TOTAL_PAGES }, (_, i) => ({
        page: (i + 1).toString(),
      }));
    },
  },
  {
    path: 'pokemons/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const pokemonService = inject(PokemonService);

      const pokemons = await lastValueFrom(pokemonService.loadPage(0));
      return pokemons.map((pokemon) => ({ id: pokemon.name }));
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
