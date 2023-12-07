const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const blogSchema = mongoose.Schema(
  {
    blogId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    displayImage: [
      {
        url: {
          type: String,
          default:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw2E17UDOxg2_y2CBAhEo6adEhKz3oqbEe7vRen6lCcQ&s",
        },
      },
    ],
    // blogCategory: {
    //   type: ObjectId,
    //   ref: 'BlogCategory',
    //   required: true,
    // },
  },
  { timestamps: true }
);

mongoose.model("Blog", blogSchema);
