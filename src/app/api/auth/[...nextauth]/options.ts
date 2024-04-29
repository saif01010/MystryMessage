import CredntialsProvider from 'next-auth/providers/credentials';
import {NextAuthOptions} from 'next-auth';
import UserModel from '@/models/user.model';
import bycrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';

export const authOptions:NextAuthOptions = {
    providers:[
        CredntialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "text", placeholder: "Enter Your Email" },
                password: { label: "Password", type: "password" }
              },
              async  authorize(credentials:any):Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [{ email: credentials.identifier }, { username: credentials.identifier }],
                    })
                    if(!user){
                        throw new Error("No user found");
                    }
                    // console.log(user)
                    if(!user.isVarified){
                        throw new Error("Please verify your email first");
                    }
                    const isValid = await bycrypt.compare(credentials.password, user.password);
                    if(isValid){
                        return user;
                    }else{
                        throw new Error("Password is incorrect");
                    
                    }
                } catch (err) {
                    console.log(err);
                    
                    throw new Error("Something went wrong",);
                }
            }
        })
    ],
    callbacks:{
        async jwt({token,user}){
            if(user){
                token._id = user._id?.toString();
                token.isVarified = user.isVarified;
                token.username = user.username;
                token.email = user.email;
                token.isAcceptingMessages = user.isAcceptingMessages;
            }
            return token;
        },
        async session({session,token}){
            session.user = token;
            return session;
        }
    },
    pages:{
        signIn: "/sign-in"
    },
    secret: process.env.NEXTAUTH_SECRET,

}