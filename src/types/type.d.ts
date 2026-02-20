export interface AuthState {
    isSignedIn: boolean;
    username: string | null;
    userId: string | null;
}

export type AuthContext = {
    isSignedIn: boolean;
    username: string | null;
    userId: string | null;
    refreshAuth: () => Promise<boolean>;
    signIn: (username: string, password: string) => Promise<boolean>;
    signOut: () => Promise<boolean>;
}