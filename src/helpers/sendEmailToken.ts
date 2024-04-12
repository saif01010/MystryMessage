import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VarificationEmail";

export async function sendEmailToken(
    email: string,
    username: string,
    verifyToken: string
):Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from:"onboarding@resend.dev",
            to: email,
            subject: "Verify your email",
            react: VerificationEmail({username,otp:verifyToken})
        });
        return {
            success: true,
            message: "Verification Email Sent"
        };
        
    } catch (error) {
        console.log("Could not send Email Token",error);
        return {
            success: false,
            message: "Failed to send email token"
        };
        
    }
}