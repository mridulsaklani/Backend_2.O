
class baseRepository{
    constructor(model){
        this.model = model
    }

    create = async(data, session = null)=>{
        const response = await this.model.create([data], session)
        return response
    }

    getAll(filter = {}, projection = null, sort = null, session = null){
        
    }

    
}