import User from "../models/user.model";
import { UserDocument } from "../types/models/user.type";
import { Filters, Projection, Session } from "../types/type.constants";
import baseRepository from "./base.repositories";

class UserRepository extends baseRepository {
  
  constructor() {
    super(User);
  }

  public findByHashedEmail = async (hashedMail: string, projection: Projection = "", session: Session = null): Promise<UserDocument> => {
    return await this.model
      .findOne({ hashEmail: hashedMail })
      .select(projection)
      .session(session);
  };

  public checkUserExist = async (filter: Filters = {}, projection: Projection = "", session: Session = null): Promise<UserDocument> => {
    const orConditions = Object.entries(filter).map(([key, value]) => ({
      [key]: value,
    }));

    return await this.model
      .findOne({ $or: orConditions })
      .select(projection)
      .session(session);
  };

  public updateLastLogin = async (userId: string, refreshToken: string, loginCount: number, session: Session = null) => {
    return await this.updateOne(
      { _id: userId },
      {
        lastLogin: new Date(),
        refreshToken,
        loginCount,
      },
      session
    );
  };
}


export default UserRepository;
