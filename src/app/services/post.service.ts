import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import HttpService from 'src/app/shared/http/http.service';
import type { PostResponse } from 'src/app/types/response/post.response';
import type { PostRequest } from 'src/app/types/request/post.request';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private httpService: HttpService) {}

  public getAll(page: number, pageSize: number): Observable<PostResponse> {
    return this.httpService.get<PostResponse>(
      `Post/GetAll?page=${page}&pageSize=${pageSize}`,
    );
  }

  public getMyPosts(): Observable<PostResponse> {
    return this.httpService.get<PostResponse>(`Post/GetMyPosts`);
  }

  public create(payload: PostRequest): Observable<PostResponse> {
    return this.httpService.post<PostResponse>(`Post`, payload);
  }

  public delete(id: number): Observable<boolean> {
    return this.httpService.delete<boolean>(`Post/${id}`);
  }
}
