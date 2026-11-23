import { Injectable, inject } from '@angular/core';
import { Api, MeetingReceiptResultDto } from 'api/backend.api';
import { AdminApiService } from '@service/admin-api.service';

@Injectable({ providedIn: 'root' })
export class MeetingReceiptService {
  private readonly api = inject(Api);
  private readonly adminApi = inject(AdminApiService);

  findOne(id: number, servicePayment = false): Promise<MeetingReceiptResultDto> {
    if (servicePayment) return this.api.serviceReceipt.servicereceiptFindOne({ id }).then((response) => response.data);
    return this.api.meetingReceipt.meetingreceiptFindOne({ id }).then((response) => response.data);
  }

  upload(id: number, file: File, servicePayment = false): Promise<MeetingReceiptResultDto> {
    if (servicePayment) return this.api.serviceReceipt.servicereceiptUpload({ id }, { file }).then((response) => response.data);
    return this.api.meetingReceipt.meetingreceiptUpload({ id }, { file }).then((response) => response.data);
  }

  async download(id: number, adminView: boolean, servicePayment = false): Promise<Blob> {
    if (servicePayment) {
      const response = adminView
        ? await this.adminApi.api.meetingAdmin.meetingadminDownloadServiceReceipt({ id }, { format: 'blob' })
        : await this.api.serviceReceipt.servicereceiptDownload({ id }, { format: 'blob' });
      if (!(response.data instanceof Blob)) throw new Error('No se pudo descargar el recibo');
      return response.data;
    }
    const response = adminView
      ? await this.adminApi.api.meetingAdmin.meetingadminDownloadReceipt({ id }, { format: 'blob' })
      : await this.api.meetingReceipt.meetingreceiptDownload({ id }, { format: 'blob' });
    if (!(response.data instanceof Blob)) throw new Error('No se pudo descargar el recibo');
    return response.data;
  }
}
