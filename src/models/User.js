import mongoose from "mongoose";

// Read-only view of the users collection owned by the users service,
// used to populate order owners and to check admin rights.
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    isAdmin: { type: Boolean, default: false },
  },
  { strict: false }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
