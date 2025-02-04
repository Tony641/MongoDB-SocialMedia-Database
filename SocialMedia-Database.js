/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

// Select the database to use.
use('SocialMediaDB');
 

// 1. Enhanced User Schema with Professional Details
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "password_hash", "account_status"],
      properties: {
        profile: {
          bsonType: "object",
          properties: {
            firstName: { bsonType: "string" },
            lastName: { bsonType: "string" },
            surName: { bsonType: "string" },
            userName: {
              bsonType: "string",
              
              minLength: 3,
              maxLength: 30
            },
            email: {
              bsonType: "string",
              description: "Must be a string and match email format.",
              pattern: "^.+@.+\\..+$"
            },
            bio: {
              bsonType: "string",
              description: "User bio.",
              maxLength: 500
            },
            dateOfBirth: {
              bsonType: "date"
            },
            phoneNumber: {
              bsonType: "object",
              required: ["countryCode", "number"],
              properties: {
                countryCode: {
                  bsonType: "string",
                  description: "Must be a valid country code.",
                  pattern: "^\\+?[1-9]\\d{0,3}$"
                },
                number: {
                  bsonType: "string",
                  description: "Must be a valid phone number without the country code.",
                  pattern: "^\\d{4,14}$"
                }
              }},
            
            
        gender: {
          bsonType: "string",
          enum: ["Male", "Female", "Other", "Prefer not to say"]
        },



            work: {
              bsonType: "array",
              items: {
                bsonType: "object",
                properties: {
                  company: { bsonType: "string" },
                  position: { bsonType: "string" },
                  start: { bsonType: "date" },
                  end: { bsonType: "date" }
                }
              }
            },
            education: {
              bsonType: "array",
              items: {
                bsonType: "object",
                properties: {
                  institution: { bsonType: "string" },
                  degree: { bsonType: "string" },
                  year: { bsonType: "int" }
                }
              }
            }
          }
        },
        social_graph: {
          bsonType: "object",
          properties: {
           
            followers: { bsonType: "array", items: { bsonType: "objectId" } },
            following: { bsonType: "array", items: { bsonType: "objectId" } },
            
            blocked: { bsonType: "array", items: { bsonType: "objectId" } }
          }
        },
        privacy_settings: {
          bsonType: "object",
          properties: {
            profile_visibility: { enum: ["public", "followers", "custom"] },
            search_indexing: { bsonType: "bool" },
            ad_targeting: { bsonType: "bool" }
          }
        },
        auth: {
          bsonType: "string",
          enum: ["email_password", "google"],
          description: "Authentication method used by the user."
        },
        security: {
          bsonType: "object",
          properties: {
            two_factor_enabled: { bsonType: "bool" },
            last_login: { bsonType: "date" },
            devices: {
              bsonType: "array",
              items: {
                bsonType: "object",
                properties: {
                  device_id: { bsonType: "string" },
                  location: { bsonType: "string" },
                  last_used: { bsonType: "date" }
                }
              }
            }
          }
        }
      }
    }
  }
});

// User Indexes
db.users.createIndex({ "profile.userName": "text" }, { weights: { "profile.userName": 10 } });
 
db.users.createIndex({ "social_graph.followers": 1 });
db.users.createIndex({ "geo_location": "2dsphere" });


// auth_email Schema
db.createCollection("auth_email", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "email", "password_hash"],
      properties: {
        user_id: { bsonType: "objectId", description: "Reference to users collection." },
        email: { bsonType: "string", pattern: "^.+@.+\\..+$" },
        password_hash: { bsonType: "string" },
        email_verified: { bsonType: "bool", default: false }
      }
    }
  }
});

// auth_google Schema
db.createCollection("auth_google", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "googleId"],
      properties: {
        user_id: { bsonType: "objectId", description: "Reference to users collection." },
        googleId: { bsonType: "string", description: "Google authentication ID" },
       
      }
    }
  }
});

// **Indexes for Uniqueness**
db.auth_google.createIndex({ googleId: 1 }, { unique: true });
db.auth_google.createIndex({ user_id: 1 }, { unique: true });
 


// **Unique Indexes**
db.auth_email.createIndex({ email: 1 }, { unique: true });
db.auth_email.createIndex({ user_id: 1 }, { unique: true });


// 2. Advanced Post Schema with Multi-Format Content
db.createCollection("posts", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["author", "created_at", "content_type"],
      properties: {
        content: {
          bsonType: "object",
          properties: {
            author: { bsonType: "objectId", description: "Reference to the users collection" },
            text: { bsonType: "string" },
            media: {
              bsonType: "array",
              items: {
                bsonType: "object",
                properties: {
                  type: { enum: ["image", "video", "gif"] },
                  url: { bsonType: "string" },
                  thumbnail: { bsonType: "string" },
                  dimensions: {
                    bsonType: "object",
                    properties: {
                      width: { bsonType: "int" },
                      height: { bsonType: "int" }
                    }
                  }
                }
              }
            }
          }
        },
        engagement: {
          bsonType: "object",
          properties: {
            reactions: {
              bsonType: "object",
              patternProperties: {
                "^[a-z]+$": { bsonType: "int" } // Dynamic reaction counts
              }
            },
            shares: {
              bsonType: "array",
              items: { bsonType: "objectId", description: "User IDs who shared the post" }
            },
            views: {
              bsonType: "array",
              items: { bsonType: "objectId", description: "User IDs who viewed the post" }
            },
            likes: {
              bsonType: "array",
              items: { bsonType: "objectId", description: "User IDs who liked the post" }
            },
            saves: {
              bsonType: "array",
              items: { bsonType: "objectId", description: "User IDs who saved the post" }
            }
          }
        },
        monetization: {
          bsonType: "object",
          properties: {
            is_sponsored: { bsonType: "bool" },
            advertiser_id: { bsonType: "objectId" },
            impression_goal: { bsonType: "int" }
          }
        }
      }
    }
  }
});





// Post Indexes
db.posts.createIndex({ author: 1, created_at: -1 });
db.posts.createIndex({ "content.media.type": 1 });
db.posts.createIndex({ "geo_tag": "2dsphere" });


//messages Schema for posts
db.createCollection("messages", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["post_id", "sender_id", "message_content", "created_at"],
      properties: {
        post_id: { bsonType: "objectId", description: "Reference to the post this message belongs to" },
        sender_id: { bsonType: "objectId", description: "Reference to the user sending the message" },
        message_content: { bsonType: "string", description: "Content of the message" },
        created_at: { bsonType: "date", description: "Timestamp when the message was created" },
        parent_message_id: { bsonType: "objectId", description: "Reference to the parent message if it's a reply" },
        replies: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              reply_id: { bsonType: "objectId", description: "Reference to the reply message" },
              sender_id: { bsonType: "objectId", description: "User who replied" },
              reply_content: { bsonType: "string", description: "Reply content" },
              created_at: { bsonType: "date" }
            }
          }
        },
        likes: {
          bsonType: "array",
          items: { bsonType: "objectId", description: "User IDs who liked the message" }
        }
      }
    }
  }
});



// **Index for Faster Message Lookup**
db.messages.createIndex({ "post_id": 1, "sender_id": 1 });
db.messages.createIndex({ "parent_message_id": 1 }); // For replies
db.messages.createIndex({ "likes": 1 }); // For likes lookup

//stories

db.createCollection("stories", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "story_content", "created_at"],
      properties: {
        user_id: { bsonType: "objectId", description: "Reference to the user who posted the story" },
        story_content: {
          bsonType: "object",
          properties: {
            text: { bsonType: "string", description: "Text content of the story" },
            media: {
              bsonType: "array",
              items: {
                bsonType: "object",
                properties: {
                  type: { enum: ["image", "video", "gif"], description: "Media type" },
                  url: { bsonType: "string", description: "URL to the media content" },
                  thumbnail: { bsonType: "string", description: "URL to the thumbnail image" }
                }
              }
            }
          }
        },
        created_at: { bsonType: "date", description: "Timestamp when the story was created" },
        engagement: {
          bsonType: "object",
          properties: {
            likes: {
              bsonType: "array",
              items: { bsonType: "objectId", description: "User IDs who liked the story" }
            },
            shares: {
              bsonType: "array",
              items: { bsonType: "objectId", description: "User IDs who shared the story" }
            },
            views: {
              bsonType: "array",
              items: { bsonType: "objectId", description: "User IDs who viewed the story" }
            },          }
        }
      }
    }
  }
});

// **Indexes for Fast Story Lookup**
db.stories.createIndex({ "user_id": 1 });
db.stories.createIndex({ "engagement.likes": 1 });
db.stories.createIndex({ "engagement.shares": 1 });
db.stories.createIndex({ "engagement.views": 1 });
//reels 
db.createCollection("reels", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "reel_content", "created_at"],
      properties: {
        user_id: { bsonType: "objectId", description: "Reference to the user who posted the reel" },
        reel_content: {
          bsonType: "object",
          properties: {
            media: {
              bsonType: "array",
              items: {
                bsonType: "object",
                properties: {
                  type: { enum: ["video", "image"], description: "Type of media (video/image)" },
                  url: { bsonType: "string", description: "URL to the reel media content" },
                  thumbnail: { bsonType: "string", description: "URL to the reel thumbnail" }
                }
              }
            },
            description: { bsonType: "string", description: "Optional description for the reel" }
          }
        },
        created_at: { bsonType: "date", description: "Timestamp when the reel was created" },
        engagement: {
          bsonType: "object",
          properties: {
            likes: {
              bsonType: "array",
              items: { bsonType: "objectId", description: "User IDs who liked the reel" }
            },
            shares: {
              bsonType: "array",
              items: { bsonType: "objectId", description: "User IDs who shared the reel" }
            },
            comments: {
              bsonType: "array",
              items: {
                bsonType: "object",
                properties: {
                  user_id: { bsonType: "objectId", description: "User ID who commented on the reel" },
                  comment_text: { bsonType: "string", description: "Text content of the comment" },
                  created_at: { bsonType: "date", description: "Timestamp when the comment was made" },
                  likes: {
                    bsonType: "array",
                    items: { bsonType: "objectId", description: "User IDs who liked the comment" }
                  },
                  replies: {
                    bsonType: "array",
                    items: {
                      bsonType: "object",
                      properties: {
                        user_id: { bsonType: "objectId", description: "User ID who replied to the comment" },
                        reply_text: { bsonType: "string", description: "Text content of the reply" },
                        created_at: { bsonType: "date", description: "Timestamp when the reply was made" },
                        likes: {
                          bsonType: "array",
                          items: { bsonType: "objectId", description: "User IDs who liked the reply" }
                        }
                      }
                    }
                  }
                }
              }
            },
            views: {
              bsonType: "array",
              items: { bsonType: "objectId", description: "User IDs who viewed the reply" }
            }          }
        }
      }
    }
  }
});

// **Indexes for Fast Reel Lookup**
db.reels.createIndex({ "user_id": 1 });
db.reels.createIndex({ "engagement.likes": 1 });
db.reels.createIndex({ "engagement.shares": 1 });
db.reels.createIndex({ "engagement.comments.user_id": 1 });
db.reels.createIndex({ "engagement.comments.likes": 1 });
db.reels.createIndex({ "engagement.comments.replies.user_id": 1 });
db.reels.createIndex({ "engagement.comments.replies.likes": 1 });
db.reels.createIndex({ "engagement.views": 1 });


//live 
db.createCollection("live_streams", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "stream_title", "stream_url", "created_at", "status"],
      properties: {
        user_id: { bsonType: "objectId", description: "Reference to the user who is streaming" },
        stream_title: { bsonType: "string", description: "Title of the live stream" },
        stream_url: { bsonType: "string", description: "URL of the live stream" },
        stream_thumbnail: { bsonType: "string", description: "Thumbnail image for the live stream" },
        created_at: { bsonType: "date", description: "Timestamp when the live stream started" },
        status: { 
          bsonType: "string",
          enum: ["live", "ended", "scheduled"],
          description: "Current status of the live stream" 
        },
        engagement: {
          bsonType: "object",
          properties: {
            likes: {
              bsonType: "array",
              items: { bsonType: "objectId", description: "User IDs who liked the live stream" }
            },
            comments: {
              bsonType: "array",
              items: {
                bsonType: "object",
                properties: {
                  user_id: { bsonType: "objectId", description: "User ID who commented on the stream" },
                  comment_text: { bsonType: "string", description: "Text content of the comment" },
                  created_at: { bsonType: "date", description: "Timestamp when the comment was made" },
                  likes: {
                    bsonType: "array",
                    items: { bsonType: "objectId", description: "User IDs who liked the comment" }
                  },
                  replies: {
                    bsonType: "array",
                    items: {
                      bsonType: "object",
                      properties: {
                        user_id: { bsonType: "objectId", description: "User ID who replied to the comment" },
                        reply_text: { bsonType: "string", description: "Text content of the reply" },
                        created_at: { bsonType: "date", description: "Timestamp when the reply was made" },
                        likes: {
                          bsonType: "array",
                          items: { bsonType: "objectId", description: "User IDs who liked the reply" }
                        }
                      }
                    }
                  }
                }
              }
            },
            views: {
              bsonType: "array",
              items: { bsonType: "objectId", description: "User IDs who viewed the reply" }

            },            
            shares: {
              bsonType: "array",
              items: { bsonType: "objectId", description: "User IDs who shares the reply" }
            }          }
        }
      }
    }
  }
});

// **Indexes for Fast Lookup**
db.live_streams.createIndex({ "user_id": 1 });
db.live_streams.createIndex({ "engagement.likes": 1 });
db.live_streams.createIndex({ "engagement.comments.user_id": 1 });
db.live_streams.createIndex({ "engagement.comments.likes": 1 });
db.live_streams.createIndex({ "engagement.comments.replies.user_id": 1 });
db.live_streams.createIndex({ "engagement.comments.replies.likes": 1 });
db.live_streams.createIndex({ "engagement.views": 1 });
db.live_streams.createIndex({ "engagement.shares": 1 });


//chats 
db.createCollection("usermessages", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["sender_id", "receiver_id", "message", "created_at"],
      properties: {
        sender_id: { bsonType: "objectId", description: "User ID of the sender" },
        receiver_id: { bsonType: "objectId", description: "User ID of the receiver" },
        message: { bsonType: "string", description: "The content of the message" },
        message_type: {
          bsonType: "string",
          enum: ["text", "image", "video", "audio", "file"],
          description: "Type of the message content"
        },
        status: {
          bsonType: "string",
          enum: ["sent", "delivered", "read"],
          description: "Status of the message"
        },
        created_at: { bsonType: "date", description: "Timestamp when the message was sent" },
        updated_at: { bsonType: "date", description: "Timestamp when the message status was last updated" },
        reactions: {
          bsonType: "object",
          properties: {
            like: { bsonType: "array", items: { bsonType: "objectId", description: "User IDs who liked the message" } },
            love: { bsonType: "array", items: { bsonType: "objectId", description: "User IDs who loved the message" } },
            laugh: { bsonType: "array", items: { bsonType: "objectId", description: "User IDs who laughed at the message" } }
          }
        },
        is_group_message: { bsonType: "bool", description: "Indicates if the message is part of a group chat" },
        group_id: { bsonType: "objectId", description: "ID of the group (if applicable)" }
      }
    }
  }
});

// **Indexes for Fast Lookup**
db.usermessages.createIndex({ "sender_id": 1, "receiver_id": 1 });
db.usermessages.createIndex({ "receiver_id": 1 });
db.usermessages.createIndex({ "status": 1 });
db.usermessages.createIndex({ "created_at": -1 });
db.usermessages.createIndex({ "is_group_message": 1 });
db.usermessages.createIndex({ "group_id": 1 });

//groups
db.createCollection("groups", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["group_name", "created_by", "members", "created_at"],
      properties: {
        group_name: { bsonType: "string", description: "Name of the group" },
        group_description: { bsonType: "string", description: "Description of the group (optional)" },
        created_by: { bsonType: "objectId", description: "User ID of the creator" },
        members: {
          bsonType: "array",
          items: { bsonType: "objectId" },
          description: "Array of user IDs that are part of the group"
        },
        created_at: { bsonType: "date", description: "Timestamp when the group was created" },
        updated_at: { bsonType: "date", description: "Timestamp when the group details were last updated" },
        image: {
          bsonType: "string",
          description: "URL or file path of the group image (optional)"
        }
      }
    }
  }
});

//group messages 
db.createCollection("groupmessages", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["group_id", "sender_id", "message", "created_at"],
      properties: {
        group_id: {
          bsonType: "objectId",
          description: "Reference to the group in which the message was sent"
        },
        sender_id: {
          bsonType: "objectId",
          description: "User ID of the sender"
        },
        message: {
          bsonType: "string",
          description: "The content of the message"
        },
        message_type: {
          bsonType: "string",
          enum: ["text", "image", "video", "audio", "file"],
          description: "Type of the message content (text, media)"
        },
        status: {
          bsonType: "string",
          enum: ["sent", "delivered", "read"],
          description: "Status of the message"
        },
        created_at: {
          bsonType: "date",
          description: "Timestamp when the message was sent"
        },
        updated_at: {
          bsonType: "date",
          description: "Timestamp when the message status was updated"
        },
        reactions: {
          bsonType: "object",
          properties: {
            like: {
              bsonType: "array",
              items: { bsonType: "objectId", description: "User IDs who liked the message" }
            },
            love: {
              bsonType: "array",
              items: { bsonType: "objectId", description: "User IDs who loved the message" }
            },
            laugh: {
              bsonType: "array",
              items: { bsonType: "objectId", description: "User IDs who laughed at the message" }
            }
          }
        },
        replies: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              reply_id: {
                bsonType: "objectId",
                description: "Unique ID for the reply"
              },
              user_id: {
                bsonType: "objectId",
                description: "ID of the user replying"
              },
              reply_message: {
                bsonType: "string",
                description: "Content of the reply message"
              },
              created_at: {
                bsonType: "date",
                description: "Timestamp of the reply"
              }
            }
          },
          description: "Array of replies to the message"
        },
        likes: {
          bsonType: "array",
          items: { bsonType: "objectId", description: "User IDs who liked the message" },
          description: "Array of users who liked the message"
        }
      }
    }
  }
});

// Indexes for Efficient Lookups
db.groupmessages.createIndex({ "group_id": 1, "created_at": -1 });
db.groupmessages.createIndex({ "sender_id": 1 });
db.groupmessages.createIndex({ "status": 1 });
db.groupmessages.createIndex({ "created_at": -1 });
db.groupmessages.createIndex({ "likes": 1 });


// notifications 
db.createCollection("notifications", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "type", "message", "created_at"],
      properties: {
        user_id: {
          bsonType: "objectId",
          description: "User ID to whom the notification is sent"
        },
        type: {
          bsonType: "string",
          enum: ["message", "like", "comment", "mention", "follow", "group_invite", "event"],
          description: "Type of notification (message, like, etc.)"
        },
        message: {
          bsonType: "string",
          description: "The notification content/message"
        },
        reference_id: {
          bsonType: "objectId",
          description: "Reference to the event that triggered the notification (e.g., message, post, etc.)"
        },
        status: {
          bsonType: "string",
          enum: ["unread", "read"],
          description: "Status of the notification (unread or read)"
        },
        created_at: {
          bsonType: "date",
          description: "Timestamp when the notification was created"
        },
        updated_at: {
          bsonType: "date",
          description: "Timestamp when the notification was last updated"
        }
      }
    }
  }
});

// Indexes for Efficient Lookups
db.notifications.createIndex({ "user_id": 1, "status": 1 });
db.notifications.createIndex({ "created_at": -1 });


//content reports 

db.createCollection("content_reports", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "reported_content_id", "content_type", "reason", "status", "created_at"],
      properties: {
        user_id: {
          bsonType: "objectId",
          description: "User ID of the person reporting the content"
        },
        reported_content_id: {
          bsonType: "objectId",
          description: "ID of the reported content (post, comment, message, etc.)"
        },
        content_type: {
          bsonType: "string",
          enum: ["post", "comment", "message", "reel", "story", "live", "group_message"],
          description: "Type of content being reported"
        },
        reason: {
          bsonType: "string",
          enum: ["spam", "abusive", "inappropriate", "harassment", "fake", "other"],
          description: "Reason for reporting the content"
        },
        status: {
          bsonType: "string",
          enum: ["pending", "reviewed", "resolved", "rejected"],
          description: "Status of the report"
        },
        additional_info: {
          bsonType: "string",
          description: "Optional additional information provided by the reporter"
        },
        created_at: {
          bsonType: "date",
          description: "Timestamp when the report was created"
        },
        updated_at: {
          bsonType: "date",
          description: "Timestamp when the report was last updated"
        }
      }
    }
  }
});

// Indexes for Efficient Lookups
db.content_reports.createIndex({ "user_id": 1 });
db.content_reports.createIndex({ "reported_content_id": 1 });
db.content_reports.createIndex({ "content_type": 1 });
db.content_reports.createIndex({ "status": 1 });
db.content_reports.createIndex({ "created_at": -1 });


//audit log
db.createCollection("audit_logs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["action_type", "user_id", "timestamp", "description", "ip_address"],
      properties: {
        action_type: {
          bsonType: "string",
          enum: ["create", "update", "delete", "login", "logout", "error", "other"],
          description: "The type of action that was performed"
        },
        user_id: {
          bsonType: "objectId",
          description: "User ID who performed the action"
        },
        timestamp: {
          bsonType: "date",
          description: "Timestamp when the action was performed"
        },
        description: {
          bsonType: "string",
          description: "A brief description of the action or event"
        },
        ip_address: {
          bsonType: "string",
          description: "IP address from which the action was performed"
        },
        affected_entity: {
          bsonType: "string",
          description: "Entity or object affected by the action (e.g., user, post, group)"
        },
        entity_id: {
          bsonType: "objectId",
          description: "ID of the affected entity"
        },
        status: {
          bsonType: "string",
          enum: ["success", "failure"],
          description: "Status of the action (whether it was successful or not)"
        },
        additional_info: {
          bsonType: "string",
          description: "Additional information related to the action, if any"
        }
      }
    }
  }
});

// Indexes for Efficient Lookups
db.audit_logs.createIndex({ "user_id": 1 });
db.audit_logs.createIndex({ "action_type": 1 });
db.audit_logs.createIndex({ "timestamp": -1 });
db.audit_logs.createIndex({ "status": 1 });
