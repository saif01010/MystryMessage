import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/user.model";
import { User } from "next-auth";
import mongoose from "mongoose";


export async function GET(req:Request){
    await dbConnect();
    const session = await getServerSession(authOptions)
    console.log(session);
    const user = session?.user as User;
    if(!user){
        return Response.json({success:false,message:'User not found'},{status:400})
    }
    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const existUser = await UserModel.aggregate([
            {$match:{_id:userId}},
            {$unwind:'$messages'},
            {$sort:{'messages.createdAt':-1}},
            {$group:{_id:'$_id',messages:{$push:'$messages'}}},

        ])
        if(!existUser || existUser.length === 0){
            return Response.json({success:false,message:'Could Not Fetch Messages Maybe User does not exist'},{status:400})
        }
        return Response.json({success:true,messages:existUser[0].messages},{status:200})

        
    }catch (error) {
        console.log('Error While fetching Messages',error)
        return Response.json({sussess:false,message:'Error While fetching Messages'},{status:500})
    }
}