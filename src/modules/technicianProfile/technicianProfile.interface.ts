

export interface CreateTechnicianProfilePayload  {
  bio?: string;
  experience?: number;
  skills?: string;
  hourlyRate?: number;
  serviceArea?: string;
};

export interface ITechnicianProfileQuery {
  searchTerm?: string;

  experience?: string;
  rating?: string;
  serviceArea?: string;

  page?: string;
  limit?: string;

  sortBy?: string;
  sortOrder?: string;
}