import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import {z} from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const usernameSchema = z.object({
    username:usernameValidation
})

export  async function POST(req:Request){
    await dbConnect();
    try {
        const {searchParams} = new URL(req.url); 
        const queryParams = {username:searchParams.get('username')};

        const result = usernameSchema.safeParse(queryParams);
        console.log(result)

        if(!result.success){

            console.log(result)
            const usernameError = result.error.format().username?._errors||[];

            return Response.json({
                success:false,
                message:usernameError?.length>0?usernameError.join(', '):'Invalid Username',
                errors:usernameError
            },{status:400})
        }

        const {username} = result.data;
        const user = await UserModel.findOne({username,isVarified:true})

        if(user){
            return Response.json({success:false,message:'Username is already taken'},{status:400})
        }

        return Response.json({success:true,message:'Username is available'},{status:200})

    }catch (error) {

        console.log('Error while validating Username',error)
        return Response.json({sussess:false,message:'Error while validating Username'},{status:500})
        
    }

} 
