export interface User {
    fullName: string;
    username: string;
    email: string;
    password: string;
    phone?: string;
    role?: string;
    isActive?: boolean;
    crateAt?: Date;
    updateAt?: Date;
}
