export interface CreateReviewPayload {
  bookingId: string;
  rating: number;
  comment?: string;
}

export interface IReviewQuery {
  searchTerm?: string;

  rating?: string;
  customerId?: string;
  technicianProfileId?: string;

  page?: string;
  limit?: string;

  sortBy?: string;
  sortOrder?: string;
}