import {z} from 'zod';

export const verifySchema = z.object({
    token: z.string().length(6,{message:"token must be of 6 digits long"})
    
});