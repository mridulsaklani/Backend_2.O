
class apiResponse{
    constructor(statusCode, message="success", data={} ){
       this.statusCode = statusCode
       this.data = data
       this.message = message
       this.success = true
    }
}

export {apiResponse}