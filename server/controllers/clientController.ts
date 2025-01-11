import { ApiError } from "../utils/ApiError.js";
import asyncHandler from 'express-async-handler';
import { ApiResponse } from "../utils/ApiResponse.js";
import Client from '../models/Client.js';

const registerUser = asyncHandler(async (req, res) => {

    const { fullName, email, username, password } = req.body; 
   

    if (
        [fullName, email, username, password].some((field) =>
            field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required !")

    }
    const userExist = await Client.findOne({
        $or: [{ username }, { email }]
    })

    if (userExist) {
        throw new ApiError(409, " User with email or username already exist")
    }
   

    const user = await Client.create({
        fullName,
        email,
        username: username.toLowerCase(),
        password,
       
    })

 
    if (!user) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    res.status(201).json(
        new ApiResponse(200, "User registered successfully", user)
    );

});


export{
    registerUser,

}