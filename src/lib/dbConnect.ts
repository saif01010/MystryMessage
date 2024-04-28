import mongoose from "mongoose";

type connectionObject = {
    isConnected?: number;
    
};

const connection: connectionObject = {};

async function dbConnect() {
    if (connection.isConnected) {
        console.log("Using existing connection");
        
        return;
    }

   try {
    console.log("Using new connection");
    // console.log(process.env.MONGO_URI);
    
     const db = await mongoose.connect(process.env.MONGO_URI as string);

    //  console.log(db);
     
 
     connection.isConnected = db.connections[0].readyState;
     console.log(connection.isConnected);
     
     console.log("Connected to MongoDB");
   } catch (error) {
     console.log(error);
     process.exit(1);
    
   }
}

export default dbConnect;