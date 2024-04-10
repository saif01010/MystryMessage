import mongoose,{Schema, Document} from "mongoose";


export interface Messages extends Document {
    content: string;
    createdAt: Date;
};

const messageSchema: Schema<Messages> = new Schema({
    content: {
        type: String,
        required: true
        },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
        }
});

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    isVarified: boolean;
    verifyToken: string;
    verifyTokenExpires: Date;
    isAcceptingMessages: boolean;
    messages: Messages[];
};

const userSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true
        },
    email: {
        type: String,
        required: [true, "Email is required"],
        match:[/^\S+@\S+\.\S+$/, "Please enter a valid email"],
        unique: true
        },
    password: {
        type: String,
        required: [true, "Password is required"]
        },
    isVarified: {
        type: Boolean,
        default: false
        },
    verifyToken: {
        type: String,
        required: [true, "Verify token is required"]
        },
    verifyTokenExpires: {
        type: Date
        },
    isAcceptingMessages: {
        type: Boolean,
        default: true
        },
    messages: [messageSchema]
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", userSchema);

export default UserModel;