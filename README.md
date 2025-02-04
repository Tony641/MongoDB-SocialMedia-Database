

---

# MongoDB-SocialMedia-Database

## Overview
This repository contains a comprehensive schema for a **Social Media Database** designed using **MongoDB**. It includes a wide variety of collections and their associated validators to represent typical entities and activities in a social media platform such as user accounts, posts, comments, messages, likes, groups, stories, and more. Additionally, it supports features like reporting, notifications, and audit logs for tracking user activity.

## Features

- **Users Collection**: Store user details including authentication methods (email/password, Google login).
- **Posts**: Represent posts with multi-format content such as text, images, videos, and more.
- **Comments & Replies**: Allow users to comment on posts and reply to comments.
- **Likes & Reactions**: Track user reactions to posts, comments, and messages (like, love, laugh).
- **Messages**: Direct messaging and group messaging capabilities.
- **Groups**: Support for user groups, their messages, and media.
- **Stories**: Temporary posts with reactions and sharing options.
- **Reels**: Support for short-form video content.
- **Live Streaming**: Schema for managing live streaming events.
- **Reports**: Users can report different types of content.
- **Audit Logs**: Track and log all actions performed in the system (e.g., user login, post creation, errors).

## Database Collections

### 1. **Users Collection**
   - Stores user details and supports multiple authentication methods (email/password, Google).
   - Includes user preferences, profiles, and authentication data.
   
### 2. **Posts Collection**
   - Stores posts with multi-format content (text, images, video, etc.).
   - Supports reactions, shares, and views tracking.
   - Monetization features like sponsored posts and impression goals.

### 3. **Comments and Replies**
   - Handles comments on posts and replies to comments.
   - Includes likes and reactions to comments.

### 4. **Messages Collection**
   - Manages user-to-user and group messaging.
   - Supports text, image, video, and file messages.
   - Tracks message status (sent, delivered, read) and reactions.

### 5. **Groups Collection**
   - Stores information about user groups, including group metadata and images.
   - Tracks group messages and their types (text, image, video, etc.).
   - Includes message reactions and user participation.

### 6. **Stories Collection**
   - Stores temporary stories posted by users with likes and shares.

### 7. **Reels Collection**
   - Manages reels (short-form video posts) and related metadata.

### 8. **Live Collection**
   - Stores live streaming events and interactions with live content.
   
### 9. **Reports Collection**
   - Users can report content with different reasons (e.g., inappropriate, spam).

### 10. **Audit Logs Collection**
   - Logs all critical actions performed in the system for security and monitoring purposes (e.g., post creation, login attempts, errors).

### 11. **Notifications Collection**
   - Keeps track of notifications sent to users (e.g., likes, comments, new followers).

### 12. **Social Graph (Follower/Following)**
   - Stores relationships between users (follower and following data).

## Installation

To use the MongoDB schema, clone this repository and set up a **MongoDB** instance. You can create the collections directly using the Mongo shell or a MongoDB GUI (e.g., MongoDB Compass).

```bash
git clone https://github.com/your-username/MongoDB-SocialMedia-Database.git
cd MongoDB-SocialMedia-Database
```

### Running the Script in Mongo Shell
```bash
mongo
> load("path_to_your_script.js")
```

### Dependencies
- MongoDB 4.2 or later
- MongoDB Atlas (optional for cloud hosting)
- MongoDB Compass (optional for GUI access)

## Usage

Once the collections are set up in your MongoDB instance, you can interact with them using MongoDB's standard commands or integrate them into your social media application backend.

### Example:
- **Creating a User**:
  ```javascript
  db.users.insertOne({
    username: "john_doe",
    email: "john@example.com",
    password: "hashed_password",
    created_at: new Date(),
    auth_method: "email_password"
  });
  ```

- **Creating a Post**:
  ```javascript
  db.posts.insertOne({
    author: ObjectId("user_id_here"),
    created_at: new Date(),
    content_type: "text",
    content: {
      text: "This is a new post!"
    },
    engagement: {
      reactions: { like: 5, love: 3 },
      share_count: 2,
      view_count: 10
    }
  });
  ```

## Contributing

Feel free to fork the repository and contribute by creating issues, pull requests, or suggesting enhancements.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or feedback, please contact:

- **Email**: antonymunene697@gmail.com
 
---
