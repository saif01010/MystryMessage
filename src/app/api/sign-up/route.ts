import UserModel from "@/models/user.model";
import { sendEmailToken } from "@/helpers/sendEmailToken";
import dbConnect from "@/lib/dbConnect";
import bycrypt from "bcryptjs";
import { use } from "react";

interface userValidation {
    email: string;
    username: string;
    password: string;

}
export async function POST (req:Request,res:Response){
    await dbConnect();
    
    try {
      const {email,username,password}:any=  await req.json();
      console.log(email,username,password);
      

      const userByUsername = await UserModel.findOne({username,isVarified:true});
      if(userByUsername){
        return Response.json(
            {
              success: false,
              message: 'Username already exists.',
            },
            { status: 400 }
          );
      }

      const userByEmail = await UserModel.findOne({email});
      let token = Math.floor(100000 + Math.random() * 900000).toString();

      if(userByEmail){
        if(userByEmail.isVarified){
            return Response.json(
                {
                  success: false,
                  message: 'User already exists.',
                },
                { status: 400 }
              );
            }else{
                const hashedPassword =  bycrypt.hashSync(password,10);
                userByEmail.verifyToken = token;
                userByEmail.verifyTokenExpires = new Date(Date.now() + 3600000);
                userByEmail.password = hashedPassword;
                await userByEmail.save(); 
            }
      }else{
        const hashedPassword = bycrypt.hashSync(password,10);
        const newUser = new UserModel({
            email,
            username,
            password: hashedPassword,
            verifyToken: token,
            verifyTokenExpires: new Date(Date.now() + 3600000)
        });
        await newUser.save();
      }

     const emailResponse = await sendEmailToken(email,username,token);
      if(!emailResponse.success){
        return Response.json(
            {
              success: false,
              message: emailResponse.message,
            },
            { status: 400 }
          );
      }

        return Response.json(
            {
              success: true,
              message: 'User registered successfully. Please verify your account.',
            },
            { status: 201 }
          );
    } catch (error) {
        console.log('Error while creating user',error);
        return Response.json(
            {
              success: false,
              message: 'Failed to register user.',
            },
            { status: 400 }
        );
        
    }
    
}
    