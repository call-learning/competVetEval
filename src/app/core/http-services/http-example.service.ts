import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class HttpExampleService {
  // constructor(private http: HttpClient) {}
  // query() {
  //   return this.http.get("url").pipe(
  //     map((res: any) => {
  //       res = res.map((raw) => {
  //         return new Example(raw);
  //       });
  //       return res as Example[];
  //     }),
  //     catchError((err) => {
  //       console.error(err);
  //       return throwError(err);
  //     })
  //   );
  // }
  // get(id: string) {
  //   return this.http.get("url").pipe(
  //     map((res) => {
  //       return new Example(res);
  //     }),
  //     catchError((err) => {
  //       console.error(err);
  //       return throwError(err);
  //     })
  //   );
  // }
}
