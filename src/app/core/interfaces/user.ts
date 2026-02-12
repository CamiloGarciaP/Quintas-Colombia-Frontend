export interface User {
    _id?: string;
    fullName: string;
    username: string;
    email: string;
    password?: string;
    phone?: string;
    role?: string[];
    isActive?: boolean;
    createAt?: Date;
    updateAt?: Date;
}
