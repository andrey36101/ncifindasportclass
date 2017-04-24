export interface User {
    name: string;
    email: string;
    password: string;
    type: string;
    gender: string;
    address?: {
        address1?: string;
        address2?: string;
        city?: string;
        state?: string;
        zipcode?: string;
        country?: string;
        phone?: string;
    }
}