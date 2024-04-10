import {z} from 'zod';

export const messageShcmea = z.object({
    content: z.string()
    .min(10,{message:"message must be atleast 10 words long"})
    .max(300,{message:"message must be atmost 500 words long"}),
    
    
});