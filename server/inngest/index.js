import { Inngest } from "inngest";
import User from "../models/user.js";
import Connection from "../models/Connection.js";
import sendEmail from "../configs/nodeMailer.js";
import Story from "../models/Story.js";
import Message from "../models/Message.js";

export const inngest = new Inngest({
  id: "friendLoop-app",
});

// ========================
// User Created
// ========================

// ========================
// User Created
// ========================

// ========================
// User Created
// ========================

const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
    triggers: [
      {
        event: "clerk/user.created",
      },
    ],
  },

  async ({ event }) => {
    try {
      console.log("🔥🔥 CLERK USER CREATED EVENT RECEIVED 🔥🔥");
      console.log(
        "🔥 EVENT DATA:",
        JSON.stringify(event.data, null, 2)
      );

      const {
        id,
        first_name,
        last_name,
        email_addresses,
        image_url,
      } = event.data;

      // ========================
      // Get Email
      // ========================

      const email =
        email_addresses?.[0]?.email_address;

      // ========================
      // Validate Clerk Data
      // ========================

      if (!id) {
        throw new Error("Clerk user ID missing");
      }

      if (!email) {
        throw new Error("Email missing");
      }

      console.log("✅ Clerk ID:", id);
      console.log("✅ Email:", email);

      // ========================
      // Check Existing User
      // ========================

      const existingUser = await User.findById(id);

      if (existingUser) {
        console.log(
          "⚠️ USER ALREADY EXISTS:",
          id
        );

        return {
          success: true,
          message: "User already exists",
          userId: id,
        };
      }

      // ========================
      // Generate Username
      // ========================

      const baseUsername =
        email
          .split("@")[0]
          .toLowerCase()
          .replace(/[^a-z0-9_]/g, "") || "user";

      let username = baseUsername;

      let usernameExists = await User.findOne({
        username,
      });

      while (usernameExists) {
        username =
          baseUsername +
          Math.floor(Math.random() * 100000);

        usernameExists = await User.findOne({
          username,
        });
      }

      console.log(
        "✅ UNIQUE USERNAME:",
        username
      );

      // ========================
      // Create User
      // ========================

      const newUser = await User.create({
        _id: id,

        email: email,

        full_name:
          `${first_name || ""} ${
            last_name || ""
          }`.trim() || "User",

        username: username,

        bio: "Hey there! I am using FrindLoop",

        profile_picture:
          image_url || "",

        cover_photo: "",

        location: "",

        followers: [],

        following: [],

        connections: [],
      });

      // ========================
      // Success
      // ========================

      console.log(
        "✅✅ USER CREATED IN MONGODB ✅✅"
      );

      console.log(
        "USER ID:",
        newUser._id
      );

      console.log(
        "USER EMAIL:",
        newUser.email
      );

      console.log(
        "USERNAME:",
        newUser.username
      );

      return {
        success: true,
        userId: newUser._id,
      };

    } catch (error) {
      // ========================
      // Error Handling
      // ========================

      console.error(
        "❌❌ USER CREATION ERROR ❌❌"
      );

      console.error(
        "ERROR NAME:",
        error.name
      );

      console.error(
        "ERROR MESSAGE:",
        error.message
      );

      console.error(
        "ERROR STACK:",
        error.stack
      );

      throw error;
    }
  }
);
// ========================
// User Updated
// ========================

const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-from-clerk",
    triggers: [
      {
        event: "clerk/user.updated",
      },
    ],
  },
  async ({ event }) => {
    const {
      id,
      first_name,
      last_name,
      email_addresses,
      image_url,
    } = event.data;

    await User.findByIdAndUpdate(id, {
      email: email_addresses[0].email_address,
      full_name: `${first_name} ${last_name}`,
      profile_picture: image_url,
    });
  }
);

// ========================
// User Deleted
// ========================

const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-from-clerk",
    triggers: [
      {
        event: "clerk/user.deleted",
      },
    ],
  },
  async ({ event }) => {
    const { id } = event.data;

    await User.findByIdAndDelete(id);
  }
);

//Inngest Function to send Reminder when a new connection request is added

const sendNewConnectionRequestReminder = inngest.createFunction(
  {
    id: "send-new-connection-request-reminder",
    triggers: [
      {
        event: "app/connection-request",
      },
    ],
  },
  async ({ event, step }) => {
    const { connectionId } = event.data;

    await step.run("send-connection-request-mail", async () => {
      const connection = await Connection.findById(connectionId)
        .populate("from_user_id to_user_id");

      const subject = "👋 New Connection Request";

      const body = `
<div style="font-family: Arial, sans-serif; padding: 20px;">
  <h2>Hi ${connection.to_user_id.full_name},</h2>

  <p>
    You have a new connection request from
    ${connection.from_user_id.full_name} -
    @${connection.from_user_id.username}
  </p>

  <p>
    Click
    <a href="${process.env.FRONTEND_URL}/connections" style="color:#10b981;">
      here
    </a>
    to accept or reject the request.
  </p>

  <br/>

  <p>Thanks,<br/>PingUp - Stay Connected</p>
</div>
`;

      // send mail here

      await sendEmail({
        to:connection.to_user_id.email,
        subject,
        body
      })
    });

    const in24Houurs = new Date(Date.now()+24*60*60*1000)
    await step.sleepUntil("wait-for-24-hours",in24Houurs);
    await step.run('send-connection-request-reminder',async ()=>{
      const connection = await Connection.findById(connectionId).populate('from_user_id to_user_id');

      if(connection.status === "accepted"){
        return {message : "Already accepted"}
      }
      const subject = "👋 New Connection Request";

      const body = `
<div style="font-family: Arial, sans-serif; padding: 20px;">
  <h2>Hi ${connection.to_user_id.full_name},</h2>

  <p>
    You have a new connection request from
    ${connection.from_user_id.full_name} -
    @${connection.from_user_id.username}
  </p>

  <p>
    Click
    <a href="${process.env.FRONTEND_URL}/connections" style="color:#10b981;">
      here
    </a>
    to accept or reject the request.
  </p>

  <br/>

  <p>Thanks,<br/>PingUp - Stay Connected</p>
</div>
`;

      // send mail here

      await sendEmail({
        to:connection.to_user_id.email,
        subject,
        body
      })
      return {message :"Reminder sent."}
    })
  }
);

// Ingest function to delete story after 24 hours

const deleteStory = inngest.createFunction(
  {
    id: "story-delete",
    triggers: [
      {
        event: "app/story.delete",
      },
    ],
  },
  async ({ event, step }) => {
    const { storyId } = event.data;

    const in24Hours = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await step.sleepUntil("wait-for-24-hours", in24Hours);

    await step.run("delete-story", async () => {
      await Story.findByIdAndDelete(storyId);

      return {
        message: "Story deleted.",
      };
    });
  }
);

const sendNotificationOfUnseenMessages = inngest.createFunction(
  {
    id: "send-unseen-messages-notification",

    triggers: {
      cron: "TZ=America/New_York 0 9 * * *",
    },
  },

  async ({ step }) => {
    const messages = await Message.find({
      seen: false,
    }).populate("to_user_id");

    const unseenCount = {};

    messages.forEach((message) => {
      const userId = message.to_user_id._id.toString();

      unseenCount[userId] =
        (unseenCount[userId] || 0) + 1;
    });

    for (const userId in unseenCount) {
      const user = await User.findById(userId);

      if (!user) continue;

      const subject = `You have ${unseenCount[userId]} unseen messages`;

      const body = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Hi ${user.full_name},</h2>

          <p>
            You have ${unseenCount[userId]} unseen messages
          </p>

          <p>
            Click 
            <a 
              href="${process.env.FRONTEND_URL}/messages"
              style="color: #10b981;"
            >
              here
            </a>
            to view them
          </p>

          <br/>

          <p>
            Thanks,<br/>
            PingUp - Stay Connected
          </p>
        </div>
      `;

      await sendEmail({
        to: user.email,
        subject,
        body,
      });
    }

    return {
      message: "Notification sent.",
    };
  }
);


// Create an empty arrya where we'll export future inngest function
export const functions = [
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion,
  sendNewConnectionRequestReminder,
  deleteStory,
  sendNotificationOfUnseenMessages
];



