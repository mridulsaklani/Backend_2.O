
class baseRepository{
    constructor(model){
        this.model = model
    }

    create = async(data = {}, session = null)=>{
        const response = await this.model.create([data], session)
        return response
    }

    findOne = async(query = {}, projection = "", session)=>{
        const response = await this.model.findOne(query).select(projection).session(session)
        return response
    }

    getAll(filter = {}, projection = null, sort = null, session = null){
        
    }

    
}


export default baseRepository