import { Model, ClientSession, ProjectionType, PopulateOptions, DeleteResult } from "mongoose";
import {Projection, Sort, Session, Populate, Data, Filters} from "../types/type.constants"
class baseRepository {
  protected model: Model<any>

  constructor(model:Model<any>) {
    this.model = model;
  }

  public create = async (data:Data = {}, session:Session = null) => {
    const options = session ? { session } : {};
    const response = await this.model.create([data], options);
    return response[0];
  };

  public find = async(filters:Filters = {}, projection: Projection = "", sort:Sort = {createdAt: -1}, session: Session = null)=>{
    const response = await this.model.find(filters).select(projection).sort(sort).session(session);
    return response
  }

  public findOne = async (query: Filters = {}, projection: Projection = "", session: Session = null) => {
    const response = await this.model
      .findOne(query)
      .select(projection)
      .sort({ createdAt: -1 })
      .session(session);
    return response;
  };

  public findById = async (id:string, projection: Projection = "", session: Session = null) => {
    const response = await this.model
      .findOne({ _id: id })
      .select(projection)
      .session(session);
    return response;
  };

  public getAll = async (
    filter:Filters = {},
    projection: Projection = "",
    sort:Sort = null,
    session: Session = null
  ) => {
    const response = await this.model
      .find(filter)
      .select(projection)
      .sort(sort)
      .session(session);
    return response;
  };

  public paginated = async (
    page:number = 1,
    limit:number = 10,
    filters:Filters = {},
    sort: Sort = null,
    session:Session = null,
    projection:Projection = "",
    populate: Populate  = null
  ) => {
    const skip = Number((page - 1) * limit);

    const count = await this.model.countDocuments(filters).session(session);

    let query = this.model
      .find(filters)
      .select(projection)
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .session(session);

    if (populate) {
      if (Array.isArray(populate)) {
        populate.forEach((pop) => {
          query = query.populate(pop);
        });
      } else {
        query = query.populate(populate);
      }
    }

    const response = await query;

    return {
      data: response,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / limit),
      },
    };
  };

  public updateOne = async (filter:Filters = {}, data: Data = {}, session: Session = null) => {
    const response = await this.model.updateOne(
      filter,
      { $set: data },
      { session: session ?? undefined }
    );
    return response;
  };

  public findOneAndUpdate = async (filter:Filters = {}, data: Data = {}, session: Session = null) => {
    const response = await this.model.findOneAndUpdate(
      filter,
      { $set: data },
      { new: true, runValidators: true, session }
    );
    return response;
  };

  public findByIdAndUpdate = async (id: string, data: Data = {}, session: Session = null) => {
    const response = await this.model.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true, session }
    );
    return response;
  };

  public deleteOne = async (filters: Filters, session: Session = null) => {
    const response = await this.model.findOneAndDelete(filters, { session });
    return response;
  };

  public findByIdAndDelete = async (id: string, session: Session = null) => {
    const response = await this.model.findByIdAndDelete(id, { session });
    return response;
  };

  public bulkDelete = async(filters: Filters, session: Session = null): Promise<DeleteResult> => {
    const response = await this.model.deleteMany(filters, { session: session ?? undefined })
    return response;
  }
}

export default baseRepository;
