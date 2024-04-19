import { getServerSession,User } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel,{Messages} from "@/models/user.model";



export async function POST(req:Request) {
    await dbConnect();
   const session =  await getServerSession(authOptions);
   const user = session?.user as User
   if(!user){
    return Response.json({success:false,message:"User not found"},{status:404})
   }
   const userId = user?._id;
   try {
    const {content, createdAt} = await req.json();
    const existUser = await UserModel.findById(userId);
    if(!existUser){
        return Response.json({success:false,message:"User not found"},{status:404})
    }

    existUser.messages.push({content,createdAt} as Messages);
    await existUser.save();
    return Response.json({success:true,message:"Message sent"},{status:200})

    
   } catch (error) {
    console.log("Error while sending message",error)
    return Response.json({success:false,message:"Error while sending message"},{status:500})
    
   }
}