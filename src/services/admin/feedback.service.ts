import { inject, Injectable } from '@angular/core';
import {
  Api,
  FeedbackCreateMultipartDto,
  FeedbackFindAllParams,
  FeedbackListDto,
  FeedbackReplyCreateDto,
  FeedbackResultDto,
} from 'api/backend.api';

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private readonly api = inject(Api);

  findAll(query: FeedbackFindAllParams = {}): Promise<FeedbackListDto> {
    return this.api.feedback.findAll(query).then((response) => response.data);
  }

  findOne(id: number): Promise<FeedbackResultDto> {
    return this.api.feedback.findOne({ id }).then((response) => response.data);
  }

  create(data: FormData): Promise<FeedbackResultDto> {
    return this.api.feedback
      .create(data as unknown as FeedbackCreateMultipartDto)
      .then((response) => response.data);
  }

  reply(id: number, data: FeedbackReplyCreateDto): Promise<FeedbackResultDto> {
    return this.api.feedback.reply({ id }, data).then((response) => response.data);
  }
}
