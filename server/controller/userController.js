import imagekit from '../configs/imagekit.js'
import fs from 'fs'
import User from "../models/user.js";
import Connection from '../models/Connection.js';
import Post from '../models/Post.js';
import { inngest } from '../inngest/index.js';
import { clerkClient } from '@clerk/express';

// Get user data using userId
export const getUserData = async (req, res) => {
  try {
    const { userId } = req.auth();

    console.log("🔥🔥 GET USER DATA 🔥🔥");
    console.log("🔥 CLERK USER ID:", userId);

    if (!userId) {
      return res.json({
        success: false,
        message: "User not authenticated",
      });
    }

    let user = await User.findById(userId);

    console.log("🔥 MONGODB USER:", user);

    if (user) {
      return res.json({
        success: true,
        user,
      });
    }

    console.log("⚠️ USER NOT FOUND IN MONGODB");
    console.log("🔥 FETCHING USER FROM CLERK...");

    const clerkUser = await clerkClient.users.getUser(userId);

    console.log("🔥 CLERK USER:", clerkUser);

    const primaryEmail = clerkUser.emailAddresses.find(
      (email) => email.id === clerkUser.primaryEmailAddressId
    );

    console.log("🔥 PRIMARY EMAIL:", primaryEmail);

    if (!primaryEmail) {
      return res.json({
        success: false,
        message: "Email not found in Clerk",
      });
    }

    const email = primaryEmail.emailAddress;

    let username = email.split("@")[0].toLowerCase();

    const usernameExists = await User.findOne({ username });

    if (usernameExists) {
      username = username + Math.floor(Math.random() * 10000);
    }

    user = await User.create({
      _id: clerkUser.id,
      email,
      full_name:
        `${clerkUser.firstName || ""} ${
          clerkUser.lastName || ""
        }`.trim() || "User",
      username,
      bio: "Hey there! I am using FrindLoop",
      profile_picture: clerkUser.imageUrl || "",
      cover_photo: "",
      location: "",
      followers: [],
      following: [],
      connections: [],
    });

    console.log("✅ USER CREATED IN MONGODB:", user);

    return res.json({
      success: true,
      user,
    });

  } catch (error) {
    console.error("❌ GET USER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Update User data
export const updateUserData = async (req, res) => {
    try {
        const { userId } = req.auth();

        const {
            username,
            bio,
            location,
            full_name
        } = req.body;

        console.log("Clerk User ID:", userId);
        console.log("Username received:", username);

        const tempUser = await User.findById(userId);

        if (!tempUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check username
        const newUsername = username?.trim();

        if (!newUsername) {
            return res.status(400).json({
                success: false,
                message: "Username cannot be empty"
            });
        }

        // Check duplicate username
        if (newUsername !== tempUser.username) {
            const existingUser = await User.findOne({
                username: newUsername,
                _id: { $ne: userId }
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "Username already exists"
                });
            }
        }

        const updatedData = {
            username: newUsername,
            bio: bio?.trim() || "",
            location: location?.trim() || "",
            full_name: full_name?.trim() || ""
        };

        console.log("Data going to MongoDB:", updatedData);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updatedData },
            {
                new: true,
                runValidators: true
            }
        );

        console.log("Updated MongoDB User:", updatedUser);

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User update failed"
            });
        }

        return res.json({
            success: true,
            user: updatedUser,
            message: "Profile updated successfully"
        });

    } catch (error) {
        console.error("UPDATE USER ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// find user using username, email , location, name

export const discoverUsers = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { input } = req.body;

        const allUser = await User.find({
            $or: [
                { username: new RegExp(input, 'i') },
                { email: new RegExp(input, 'i') },
                { full_name: new RegExp(input, 'i') },
                { location: new RegExp(input, 'i') }
            ]
        });

        const filteredUsers = allUser.filter(
            user => user._id.toString() !== userId
        );

        res.json({
            success: true,
            users: filteredUsers
        });

    } catch (error) {
        console.log("DISCOVER USERS ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//Follow user

export const followUser = async (req,res)=>{
    try {
        const {userId} = req.auth();
        const {id} = req.body;

        const user = await User.findById(userId)

        if(user.following.includes(id)){
            return res.json({success:false, message:'You are already following this user'})
        }
        user.following.push(id);
        await user.save()

        const toUser = await User.findById(id)
        toUser.followers.push(userId)
        await toUser.save()

        res.json({success:true , message:"Now you are following this  user"})
        
    } catch (error) {
        console.log(error);
        res.json({success:false , message:error.message})
    }
}

//unfollow user

export const unfollowUser = async (req,res)=>{
    try {
        const {userId} = req.auth();
        const {id} = req.body;

        const user = await User.findById(userId)
        user.following = user.following.filter(user => user !== id);
        await user.save();

        const toUser = await User.findById(id);
        toUser.followers = toUser.followers.filter(user => user !== userId);
        await toUser.save()

        res.json({success:true , message:"You are no longer following this user"})
        
    } catch (error) {
        console.log(error);
        res.json({success:false , message:error.message})
    }
}


//send connection request


export const sendConnectionRequesst = async(req,res) => {
    try {
        const {userId} = req.auth()
        const {id} = req.body;

        //check if user has sent more than 20 connection request in the last 24 hours

        const last24Hours = new Date(Date.now() - 24*60*60*1000)
        const connectionRequests = await Connection.find({from_user_id: userId , created_at:{$gt: last24Hours}})
        if(connectionRequests.length >= 20){
            return res.json({success:false , message:'You have sent more than 20 connection request in the last 24 hours'});
        }

        // Check if users are already connected

        const connection = await Connection.findOne({
            $or: [
                {from_user_id: userId , to_user_id: id},
                {from_user_id: id , to_user_id: userId},
            ]
        })

        if(!connection){
            const newConnection = await Connection.create({
                from_user_id: userId,
                to_user_id: id
            })

            await inngest.send({
                name :'app/connection-request',
                data: {connectionId: newConnection._id}
            })

            return res.json({success:true , message:'Connection request send successfully'})
        }else if(connection && connection.status === 'accepted'){
            return res.json({success:false , message:'You are already connected with this user'});
        }

        return res.json({success : false , message : 'Connection request pending'})



    } catch (error) {
        console.log(error);
        res.json({success: false , message:error.message})
    }
}



// Get user connection

export const getUserConnection = async (req, res) => {
    try {
        const { userId } = req.auth();

        const user = await User.findById(userId)
            .populate('connections followers following');

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        const connections = user.connections;
        const followers = user.followers;
        const following = user.following;

        const pendingConnections = (
            await Connection.find({
                to_user_id: userId,
                status: 'pending'
            }).populate('from_user_id')
        ).map(connection => connection.from_user_id);

        res.json({
            success: true,
            connections,
            followers,
            following,
            pendingConnections
        });

    } catch (error) {
        console.log(error);

        res.json({
            success: false,
            message: error.message
        });
    }
};


// Accept Connection Request
export const acceptConnectionRequest = async(req,res) => {
    try {
        const {userId} = req.auth()
        
        const {id} = req.body;

        const connection = await Connection.findOne({from_user_id: id , to_user_id: userId})

        if(!connection){
            return res.json({success:false , message: 'Connection not found'})
        }

        const user = await User.findById(userId);
        user.connections.push(id);
        await user.save()

        const toUser = await User.findById(userId);
        toUser.connections.push(userId);
        await toUser.save()


        connection.status = 'accepted';
        await connection.save()

        res.json({success:true , message:'Connction accepted successfully'});

    } catch (error) {
        console.log(error);
        res.json({success: false , message:error.message})
    }
}


// Get User Profile

export const getUserProfiles = async (req,res)=>{
    try {
        const {profileId} = req.body;
        const profile = await User.findById(profileId);
        if(!profile){
            return res.json({success: false , message:"Profile not found"})
        }
        const posts = await Post.find({usser: profileId}).populate('user')
        res.json({success:true , profile, posts})
    } catch (error) {
        console.log(error);
        res.json({success:false , message:error.message});
    }
}