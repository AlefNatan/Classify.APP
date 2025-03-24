import { Injectable } from '@angular/core';

import HttpService from 'src/app/shared/http/http.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private httpService: HttpService) {}
}
