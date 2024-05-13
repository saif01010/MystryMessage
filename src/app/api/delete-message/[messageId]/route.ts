import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { User } from "next-auth";
import mongoose from "mongoose";
import { authOptions } from "../../auth/[...nextauth]/options";




export async function GET(req:Request, {params}:{params:{messageId:string}}){
    const messageID = params.messageId;
    await dbConnect();
    const session = await getServerSession(authOptions)
    console.log(session);
    const user = session?.user as User;
    if(!user){
        return Response.json({success:false,message:'User not found'},{status:400})
    }
    const userId = new mongoose.Types.ObjectId(user._id);

    try {
       const updatedUser =  await UserModel.updateOne(
        {_id:userId},
        {$pull:{messages:{_id:messageID}}}
        )
        if(updatedUser.modifiedCount>0){
            return Response.json(
                {success:true,
                message:'Message Deleted'
                }
                ,{
                    status:200
                 }
            )
        }
        
    }catch (error) {
        console.log('Error while deleting Message',error)
        return Response.json({sussess:false,message:'Could not delete Message'},{status:500})
    }
}