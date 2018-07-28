import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
 
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
 
import { hero } from './hero';
import { MessageService } from './message.service';
 
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable({ providedIn: 'root' })
export class HeroService {
 
  private heroesUrl = 'api/heroes';  
 
  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
 
  getHeroes (): Observable<hero[]> {
    return this.http.get<hero[]>(this.heroesUrl)
      .pipe(
        tap(heroes => this.log('fetched heroes')),
        catchError(this.handleError('getHeroes', []))
      );
  }
 
  getHeroNo404<Data>(id: number): Observable<hero> {
    const url = `${this.heroesUrl}/?id=${id}`;
    return this.http.get<hero[]>(url)
      .pipe(
        map(heroes => heroes[0]), 
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} hero id=${id}`);
        }),
        catchError(this.handleError<hero>(`getHero id=${id}`))
      );
  }
 
  getHero(id: number): Observable<hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<hero>(`getHero id=${id}`))
    );
  }
 
 
  searchHeroes(term: string): Observable<hero[]> {
    if (!term.trim()) {
      
      return of([]);
    }
    return this.http.get<hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching "${term}"`)),
      catchError(this.handleError<hero[]>('searchHeroes', []))
    );
  }
 
  
 
  addHero (hero: hero): Observable<hero> {
    return this.http.post<hero>(this.heroesUrl, hero, httpOptions).pipe(
      tap((hero: hero) => this.log(`added hero w/ id=${hero.id}`)),
      catchError(this.handleError<hero>('addHero'))
    );
  }
 
  deleteHero (hero: hero | number): Observable<hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;
 
    return this.http.delete<hero>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<hero>('deleteHero'))
    );
  }
 
  updateHero (hero: hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
 
      
      console.error(error); 
 
      
      this.log(`${operation} failed: ${error.message}`);
 
      
      return of(result as T);
    };
  }
 
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}