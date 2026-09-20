import Comment from "../models/Comment.js";
import User from "../models/user.js";

// ==========================================
// ADD COMMENT
// ==========================================

export const addComment = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { postId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.json({
        success: false,
        message: "Comment cannot be empty",
      });
    }

    // Clerk userId = User document _id
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Create comment
    const comment = await Comment.create({
      post_id: postId,
      user_id: user._id,
      text: text.trim(),
    });

    // Populate user information
    const populatedComment = await Comment.findById(
      comment._id
    ).populate(
      "user_id",
      "full_name username profile_picture"
    );

    res.json({
      success: true,
      message: "Comment added successfully",
      comment: populatedComment,
    });
  } catch (error) {
    console.log("ADD COMMENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET POST COMMENTS
// ==========================================

export const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({
      post_id: postId,
    })
      .populate(
        "user_id",
        "full_name username profile_picture"
      )
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      comments,
    });
  } catch (error) {
    console.log("GET COMMENTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};