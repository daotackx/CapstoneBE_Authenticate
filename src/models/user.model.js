import mongoose from 'mongoose'
const { Schema } = mongoose

// Enum cho role và gender
const ROLE = ['admin', 'user', 'parent']
const GENDER = ['male', 'female', 'other']

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      // required: true
    },
    full_name: {
      type: String,
      required: true
    },
    phone_number: {
      type: String,
      required: false
    },
    role: {
      type: String,
      enum: ROLE,
      default: 'user'
    },
    gender: {
      type: String,
      enum: GENDER,
      required: false
    },
    avatar: {
      type: String,
      required: false
    },
    dob: {
      type: Date,
      required: false
    },
    address: {
      type: String,
      required: false
    },
    status: {
      type: Boolean,
      default: true
    },
    is_verified: {
      type: Boolean,
      default: false
    },
    parent_of: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
      }
    ]
  },
  {
    timestamps: true
  }
)


export default mongoose.model('User', userSchema)
