'use client'
import React, { use, useEffect, useState } from 'react'
import {zodResolver} from '@hookform/resolvers/zod'
import { Form, 
         FormControl,
         FormField,
         FormItem,
         FormLabel,
         FormMessage } from '@/components/ui/form'
import { useDebounce } from 'use-debounce';
import {useRouter} from 'next/navigation'
import {useToast} from '@/components/ui/use-toast'
import * as z from 'zod'
import { signUpSchema } from '@/schemas/signUpSchema'
import  {useForm} from 'react-hook-form'
import axios ,{AxiosError}from 'axios'
import {ApiResponse} from '@/types/ApiResponse'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
const SignUpPage = () => {
    const [username, setUsername] = useState('')
    const [isSubmiting, setIsSubmiting] = useState(false)
    const [isCheakingUsername, setIsCheakingUsername] = useState(false)
    const [usernameMessage, setUsernameMessage] = useState('')
    const [debouncedUsername] = useDebounce(username, 1000);
    const router = useRouter()
    const {toast} = useToast()
    const form = useForm<z.infer<typeof signUpSchema>>({
      resolver: zodResolver(signUpSchema),
      defaultValues:{
        username: '',
        email: '',
        password: '',
      }
    })
    useEffect(()=>{
    const checkUsername= async ()=>{
      if(username === ''){
        setUsernameMessage('')
        return
      }
      if(debouncedUsername){
        setIsCheakingUsername(true)
        setUsernameMessage('')
      }
      try {
        const response = await axios.get(`api/check-username-unique?username=${debouncedUsername}`)
        console.log(response)
        setUsernameMessage(response.data.message);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? 'Error checking username'
          );
      }finally{
        setIsCheakingUsername(false)
      }

    };
    checkUsername();
    },[debouncedUsername])
   const handleSubmit = async (data: z.infer<typeof signUpSchema>) => {
      setIsSubmiting(true)
      try {
        const response = await axios.post('/api/sign-up',data);
        toast({
          title: "Success",
          description: response.data.message,
        })
        router.replace(`/verify/${username}`)

      } catch (error) {
        console.error('Error during sign-up:', error);
        const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? 'Error checking username'
          );
      }finally{
        setIsSubmiting(false)
      }
   }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
      <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystry Message
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field}
                onChange={(e)=>{
                  field.onChange(e)
                  setUsername(e.target.value)
                }}
              />
              </FormControl>
              {isCheakingUsername && <Loader2 className="animate-spin"/>}
              {!isCheakingUsername && usernameMessage && (
                <p
                className={`text-sm ${
                  usernameMessage === 'Username is available'
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}
              >
                {usernameMessage}
              </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
           <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} name="email" />
                  <p className='text-muted text-gray-400 text-sm'>We will send you a verification code</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} name="password" />
                  <FormMessage />
                </FormItem>
              )}
            />
       <Button type="submit" className='w-full' disabled={isSubmiting}>
              {isSubmiting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
      </form>
    </Form>
    <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>

      </div>
      
    </div>
  )
}

export default SignUpPage
