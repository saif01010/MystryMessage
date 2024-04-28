import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";

export async function POST(req:Request){
    await dbConnect();
    try {
        const {username,code} = await req.json();
        const decodedUsername = decodeURIComponent(username)
        console.log(code)
        const user = await UserModel.findOne({username:decodedUsername})
        if(!user){
            return Response.json({success:false,message:'Invalid Username'},{status:400})
        }
        const isCodeValid = user.verifyToken === code;
        const isCodeExpired = new Date(user.verifyTokenExpires)>new Date();
        if(!isCodeValid){
            return Response.json({success:false,message:'Invalid Code'},{status:400})
        }
        if(!isCodeExpired){
            return Response.json({success:false,message:'Code Expired'},{status:400})
        }
        user.isVarified = true;
        await user.save();
        return Response.json({success:true,message:'Code Verified'},{status:200})
        
    } catch (error) {
        console.log('Error while Verifying Code',error)
        return Response.json({sussess:false,message:'Error while Verifying Code'},{status:500})
        
    }
}