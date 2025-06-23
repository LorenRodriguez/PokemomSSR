import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Pokemon, PokemonAPIResponse, SimplePokemon } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private http = inject(HttpClient);
  private urlBase = 'https://pokeapi.co/api/v2/pokemon';

  elementsPerPage = signal(20);

  loadPage(page: number): Observable<SimplePokemon[]> {
    if (page !== 0) {
      --page;
    }

    page = Math.max(0, page);

    return this.http
      .get<PokemonAPIResponse>(this.urlBase, {
        params: {
          offset: this.getOffset(page),
          limit: this.elementsPerPage(),
        },
      })
      .pipe(
        map((resp) => {
          const simplePokemons: SimplePokemon[] = resp.results.map(
            (pokemon) => ({
              id: pokemon.url.split('/').at(-2) ?? '',
              name: pokemon.name,
            })
          );

          return simplePokemons;
        })
      );
  }

  getPokemon(id: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.urlBase}/${id}`);
  }

  private getOffset(page: number): number {
    return page * this.elementsPerPage();
  }
}
