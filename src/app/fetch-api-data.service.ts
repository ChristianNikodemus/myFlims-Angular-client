import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://my-films-db.herokuapp.com/';

const token = localStorage.getItem('token');

const headers = {
  headers: new HttpHeaders({
    Authorization: 'Bearer ' + token,
  }),
};

export interface Movie {
  _id: string;
  Title: string;
  Description: string;
  Year: string;
  Genre: Genre;
  Director: Director;
  ImagePath: string;
  Featured: boolean;
}

export interface Genre {
  Title: string;
  Description: string;
}

export interface Director {
  Name: string;
  Bio: string;
  Birthyear: string;
  Deathyear: string;
}

export interface User {
  _id: string;
  Name: string;
  Username: string;
  Email: string;
  Password: string;
  Birthday: string;
  FavouriteMovies: Array<string>;
}

export type RegistrationUser = Omit<User, '_id' | 'FavouriteMovies'>;

export type LoginUser = Omit<
  User,
  '_id' | 'Name' | 'Email' | 'Birthday' | 'FavouriteMovies'
>;

@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  constructor(private http: HttpClient) {}

  // --------------- Endpoints --------------------

  // User registration
  public userRegistration(userDetails: RegistrationUser): Observable<User> {
    console.log(userDetails);
    return this.http
      .post<User>(apiUrl + 'users/register', userDetails)
      .pipe(catchError(this.handleError));
  }

  // User login
  public userLogin(
    userDetails: LoginUser
  ): Observable<{ user: User; token: string }> {
    console.log(userDetails);
    return this.http
      .post<{ user: User; token: string }>(apiUrl + 'login', userDetails)
      .pipe(catchError(this.handleError));
  }

  // Get all movies
  getAllMovies(): Observable<Array<Movie>> {
    const token = localStorage.getItem('token');
    return this.http
      .get<Array<Movie>>(apiUrl + 'movies', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get one movie
  getMovie(title: string): Observable<Movie> {
    const token = localStorage.getItem('token');
    return this.http
      .get<Movie>(apiUrl + `movies/:title`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get director
  getDirector(name: string): Observable<Director> {
    const token = localStorage.getItem('token');
    return this.http
      .get<Director>(apiUrl + `directors/:director`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get genre
  getGenre(title: string): Observable<Genre> {
    const token = localStorage.getItem('token');
    return this.http
      .get<Genre>(apiUrl + `genres/:name`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get user
  getUser(username: string): Observable<User> {
    const token = localStorage.getItem('token');
    return this.http
      .get<User>(apiUrl + `users/${username}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get favourite movies for a user
  getFavoriteMovies(username: string): Observable<User> {
    const token = localStorage.getItem('token');
    return this.http
      .get<User>(apiUrl + `users/${username}/movies`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Add a movie to favourite Movies
  addMovie(movieId: string): Observable<User> {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    console.log(apiUrl + `users/${username}/movies/${movieId}`);
    return this.http
      .post<User>(
        apiUrl + `users/:Username/movies/:MovieID`,
        {},
        {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
          }),
        }
      )
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Edit user
  editUser(userDetails: User): Observable<User> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('users/:Username');
    return this.http
      .put<User>(apiUrl + `users/${username}`, userDetails, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Delete user
  deleteUser(): Observable<User> {
    const username = localStorage.getItem('/users/:Username/movies/:MovieID');
    const token = localStorage.getItem('token');
    return this.http
      .delete<User>(apiUrl + `users/${username}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Delete a movie from the favourite movies
  deleteMovie(movieid: string): Observable<User> {
    const username = localStorage.getItem('/users/:Name/movies/:MovieID');
    const token = localStorage.getItem('token');
    return this.http
      .delete<User>(apiUrl + `users/${username}/movies/${movieid}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // --------------- Endpoints --------------------

  // Non-typed response extraction
  private extractResponseData(res: Response | Object): any {
    const body = res;
    return body || {};
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }
}
