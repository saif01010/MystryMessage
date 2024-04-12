import UserModel from "@/models/user.model";
import { sendEmailToken } from "@/helpers/sendEmailToken";
import dbConnect from "@/lib/dbConnect";
import bycrypt from "bcryptjs";

export async function POST (req:Request,res:Response){
    await dbConnect();
   
    try {
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
    