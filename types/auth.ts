interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  cidNumber: string;
  roleType: string;
  email: string;
  password: string;
  mobileNo: string;
  avatar: string | null;
  status: string;
  ability: any[];
}

interface Token {
  expiresIn: number;
  accessToken: string;
}

interface UserResponse {
  user: User;
  token: Token;
  id: string;
}

export interface AuthResponse {
  user: UserResponse;
  expires: string;
}
