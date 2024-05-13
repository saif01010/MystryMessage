'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { X } from "lucide-react"
import axios, { AxiosError } from "axios"
import {Messages} from "@/models/user.model"
import { useToast } from "./ui/use-toast"
import { ApiResponse } from "@/types/ApiResponse"

type MessageProps = {
    message: Messages;
    onMessageDelete: (messageId:string)=>void
}

export const MessageCard = ({message, onMessageDelete}:MessageProps) => {
    const messageId = message._id;
    const {toast} = useToast();
    const handleDelteMessage = async() => {
      try {
        const response =  await axios.delete(`/api/delete-message/${messageId}`);
        toast({
          title: response.data.message,
          variant:'default'
      })
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Error',
          description:
            axiosError.response?.data.message ?? 'Failed to delete message',
          variant: 'destructive',
        });
      } 
    }
  return (
    <Card>
        <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <AlertDialog>
                <AlertDialogTrigger><X className=" w-5 h-5"/></AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelteMessage}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
        </CardContent>
    </Card>
  )
}
