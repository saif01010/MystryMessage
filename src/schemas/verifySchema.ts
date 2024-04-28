import {z} from 'zod';

export const verifySchema = z.object({
    code: z.string().length(6,{message:"token must be of 6 digits long"})
    
});