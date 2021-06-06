export interface AuthenticationState {
  userName?: string,
  isAuthenticated: boolean,
  roles: string[]
}

export const initialState: AuthenticationState = {
  isAuthenticated: false,
  roles: []
};
