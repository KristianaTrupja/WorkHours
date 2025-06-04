// types/user.ts
export type User = {
    id: number;
    username: string;
    email: string;
    role: string;
    createdAt?: string;
    updatedAt?: string;
  };
  
  export type UserFormData = {
    id: number;
    username: string;
    email: string;
    password: string;
    role: string;
  };
  