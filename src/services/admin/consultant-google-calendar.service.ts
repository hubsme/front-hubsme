import { Injectable, inject } from '@angular/core';
import { Api, ApiQuery, ApiResponse } from 'api/backend.api';

@Injectable({
  providedIn: 'root',
})
export class ConsultantGoogleCalendarService {
  private api = inject(Api);

  authUrl(
    query: ApiQuery<'consultantGoogleCalendar', 'consultantgooglecalendarAuthUrl'>,
  ): Promise<ApiResponse<'consultantGoogleCalendar', 'consultantgooglecalendarAuthUrl'>> {
    return this.api.consultantGoogleCalendar.consultantgooglecalendarAuthUrl(query).then((response) => response.data);
  }

  status(
    query: ApiQuery<'consultantGoogleCalendar', 'consultantgooglecalendarStatus'>,
  ): Promise<ApiResponse<'consultantGoogleCalendar', 'consultantgooglecalendarStatus'>> {
    return this.api.consultantGoogleCalendar.consultantgooglecalendarStatus(query).then((response) => response.data);
  }

  busyMonth(
    query: ApiQuery<'consultantGoogleCalendar', 'consultantgooglecalendarBusyMonth'>,
  ): Promise<ApiResponse<'consultantGoogleCalendar', 'consultantgooglecalendarBusyMonth'>> {
    return this.api.consultantGoogleCalendar.consultantgooglecalendarBusyMonth(query).then((response) => response.data);
  }

  disconnect(
    query: ApiQuery<'consultantGoogleCalendar', 'consultantgooglecalendarDisconnect'>,
  ): Promise<ApiResponse<'consultantGoogleCalendar', 'consultantgooglecalendarDisconnect'>> {
    return this.api.consultantGoogleCalendar.consultantgooglecalendarDisconnect(query).then((response) => response.data);
  }
}
