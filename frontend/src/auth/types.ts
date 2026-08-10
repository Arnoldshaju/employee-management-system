export type UserRole = 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE'

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  role: UserRole
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface AuthResponse extends AuthTokens {
  user: User
}

export interface RegisterInput {
  username: string
  email: string
  password: string
  first_name: string
  last_name: string
}
