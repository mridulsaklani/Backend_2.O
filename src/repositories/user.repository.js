import User from "../models/user.model.js";
import baseRepository from "./base.repositories.js";

class UserRepository extends baseRepository {
  constructor() {
    super(User);
  }

  findByHashedEmail = async (hashedMail, projection = null, session = null) => {
    return await this.model
      .findOne({ hashEmail: hashedMail })
      .select(projection)
      .session(session);
  };

  checkUserExist = async (filter = {}, projection = null, session = null) => {
    const orConditions = Object.entries(filter).map(([key, value]) => ({
      [key]: value,
    }));

    return await this.model
      .findOne({ $or: orConditions })
      .select(projection)
      .session(session);
  };

  updateLastLogin = async (userId, refreshToken, session = null) => {
    return await this.updateOne(
      { _id: userId },
      {
        lastLogin: new Date(),
        refreshToken,
        $inc: { loginCount: 1 },
      },
      session
    );
  };
}

const userRepository = new UserRepository();
export default userRepository;
