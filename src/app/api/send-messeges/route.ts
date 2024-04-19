import dbConnect from "@/lib/dbConnect";
import UserModel,{Messages} from "@/models/user.model";



export async function POST(req:Request) {
    await dbConnect();
//    const session =  await getServerSession(authOptions);
//    const user = session?.user as User
//    if(!user){
//     return Response.json({success:false,message:"User not found"},{status:404})
//    }
//    const userId = user?._id;
   try {
    const {username,content} = await req.json();
    const user = await UserModel.findOne({username});
    if(!user){
        return Response.json({success:false,message:"User not found"},{status:404})
    }
    if(!user.isAcceptingMessages){
        return Response.json({success:false,message:"User is not accepting messages"},{status:400})
    }
    const newMesseges = {content, createdAt: new Date()};

    user.messages.push(newMesseges as Messages);
    await user.save();
    return Response.json({success:true,message:"Message sent"},{status:200})

    
   } catch (error) {
    console.log("Error while sending message",error)
    return Response.json({success:false,message:"Error while sending message"},{status:500})
    
   }
}