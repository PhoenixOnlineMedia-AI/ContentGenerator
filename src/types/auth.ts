export interface User {
    id: string;
    email: string;
    name: string;
    credits: number;
    subscription?: {
      tier: string;
      status: string;
    };
  }
  
  export interface AuthResponse {
    token: string;
    user: User;
  }  