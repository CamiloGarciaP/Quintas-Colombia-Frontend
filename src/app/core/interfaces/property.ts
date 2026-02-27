export interface Property {
    _id?: string;       // El signo de interrogación es porque el id es opcional
    owner: string;
    nameProperty: string;
    description: string;
    propertyType: string;
    maxGuests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
    location: {
        state: string;
        city: string;
        address: string;
        reference: string;
        coordinates: {
            lat: number;
            lng: number;
        }
    };
    pricing: {
        pricePerNight: number;
        currency: string;
        cleaningFee: number;
        minimumNights: number;
    };
    amenities: string[];
    houseRules: string;
    photos: {
        url: string;
        description?: string;  // El signo de interrogación es porque la descripción es opcional
    }[];
    isPublished: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}