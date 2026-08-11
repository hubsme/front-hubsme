import { TimeSlotPickerOption } from '@module/admin/components/time-slot-picker/time-slot-picker';
import { ApiResponse } from 'api/backend.api';

export type ConsultantOption = ApiResponse<'consultant', 'findAll'>['data'][number];
export type InitialMeetingSlot = TimeSlotPickerOption;

export type ConsultantSelection = {
  userId: number;
  fullName: string;
  headline: string | null;
  photoUrl: string | null;
  diagnosticAreas: string[];
  specialties: string[];
  yearsExperience: number;
  rating: string;
  reason: string | null;
};
