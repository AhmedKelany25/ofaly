import { AppointmentState, Gender } from 'src/app/shared/enums.enum';

export interface Doctor {
  sid: string;
  name: string;
  specialty: string[];
  rating: number;
  attributes: string;
  gender: Gender;
  location: string;
  slots: any;
  url: string;
}

export interface Appointment {
  sid: string;
  patient_sid: string;
  doctor_sid: string;
  date: string;
  time: string;
  state: AppointmentState;
  attributes: string;
  url: string;
  doctor: Doctor;
}

export interface DoctorAppointments extends Doctor {}

export interface Specialty {
  en: string;
  ar: string;
}
