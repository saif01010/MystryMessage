import 'next-auth'

declare module "next-auth" {
    interface User {
        _id?: string;
        isVarified?: boolean;
        username?: string;
        email?: string;
        isAcceptingMessages?: boolean;
    }
    
}