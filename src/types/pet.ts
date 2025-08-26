export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  species?: string;
  breed?: string;
  dob?: string;
  photos?: string[];
  microchipId?: string;
  emergencyContact?: string;
}
