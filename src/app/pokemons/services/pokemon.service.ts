import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
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
    return this.http
      .get<Pokemon>(`${this.urlBase}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private getOffset(page: number): number {
    return page * this.elementsPerPage();
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.log('An error ocurred:', error.error);
    } else {
      console.log(`Bakend returned code ${error.status}, body:`, error.error);
    }

    const errorMessage = error.error ?? 'An error ocurred';

    return throwError(() => new Error(errorMessage));
  }
}
