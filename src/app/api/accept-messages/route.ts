import { getServerSession, User } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/user.model";



export async function POST(req: Request, res: Response) {
    await dbConnect();
    const session = await getServerSession(authOptions)
    console.log(session);
    const user = session?.user as User;
    if(!user){
        return Response.json({success:false,message:'User not found'},{status:400})
    }
    const userId = user._id;
    try {
        const {acceptingMessages} = await req.json();
        const existUser = await UserModel.findByIdAndUpdate(userId,
            {
                isAcceptingMessages:acceptingMessages
            }
        ,{new:true}
    );

        if(!existUser){
            return Response.json({success:false,message:'User not found'},{status:400})
        }
        return Response.json({success:true,message:'Messages Accepted'},{status:200})

    } catch (error) {
        console.log('Error while Accepting Messages',error)
        return Response.json({sussess:false,message:'Error while Accepting Messages'},{status:500})
        
    }
}


export async function GET(req: Request, res: Response) {
    await dbConnect();
    const session = await getServerSession(authOptions)
    console.log(session);
    const user = session?.user as User;
    if(!user){
        return Response.json({success:false,message:'User not found'},{status:400})
    }
    const userId = user._id;
    try {
        const existUser = await UserModel.findById(userId);
        if(!existUser){
            return Response.json({success:false,message:'User not found'},{status:400})
        }
        return Response.json({success:true,isAcceptingMessages:existUser.isAcceptingMessages},{status:200})

    } catch (error) {
        console.log('Error while sending Accepting Messages',error)
        return Response.json({sussess:false,message:'Error while sending Accepting Messages'},{status:500})
        
    }
}