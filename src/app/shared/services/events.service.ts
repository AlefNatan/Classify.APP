import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private postUpdateSubject = new Subject<void>();

  public postUpdate$ = this.postUpdateSubject.asObservable();

  public emitPostUpdate(): void {
    this.postUpdateSubject.next();
  }
}
