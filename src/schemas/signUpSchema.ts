import {z} from 'zod';

export const usernameValidation = z.string()
                         .min(3,{message:"username must be atleast 3 words"})
                         .max(20,{message:"username must be atmost 20 words"})
                         .regex(/^[a-zA-Z0-9_]*$/, {message:"username must contain only alphabets, numbers and underscore"});
                        
export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message:"Invalid email"}),
    password: z.string().min(6,{message:"password must be atleast 6 words"}),
   
});
