import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { throwError } from "rxjs";
import { catchError, map, retry } from "rxjs/operators";
import { Example } from "src/app/shared/models/example.model";

@Injectable({
  providedIn: "root",
})
export class HttpExampleService {
  constructor(private http: HttpClient) {}

  query() {
    return this.http.get("url").pipe(
      retry(2),
      map((res: any) => {
        res = res.map((raw) => {
          return new Example(raw);
        });
        return res as Example[];
      }),
      catchError((err) => {
        console.error(err);
        return throwError(err);
      })
    );
  }

  get(id: string) {
    return this.http.get("url").pipe(
      retry(2),
      map((res) => {
        return new Example(res);
      }),
      catchError((err) => {
        console.error(err);
        return throwError(err);
      })
    );
  }
}
