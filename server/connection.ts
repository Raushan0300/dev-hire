import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/devhire").then(() => {
    console.log("Connected to database");
    }
).catch((error) => {
    console.log("Error connecting to database", error);
}
);

export default mongoose;