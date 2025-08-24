
class baseRepository{
    constructor(model){
        this.model = model
    }

    create = async(data = {}, session = null)=>{
        const options = session ? {session} : {};
        const response = await this.model.create([data], options)
        return response[0]
    }

    findOne = async(query = {}, projection = null, session = null)=>{
        const response = await this.model.findOne(query).select(projection).session(session)
        return response
    }

    getAll =  async(filter = {}, projection = null, sort = null, session = null) => {
        const response = await this.model.find(filter).select(projection).sort(sort).session(session)
        return response
    }

    updateOne = async(filter = {}, data = {}, session = null) =>{
        const response = await this.model.updateOne(filter, {$set: data}, { session})
        return response
    }

    findOneAndUpdate = async(filter = {}, data = {}, session = null) => {
        const response = await this.model.findOneAndUpdate(filter, {$set:data}, {new: true, runValidators: true, session})
        return response
    }

    
}


export default baseRepository