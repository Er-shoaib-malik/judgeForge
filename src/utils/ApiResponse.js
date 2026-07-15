class ApiResponse {
    constructor(
        statusCode ,
        message = "Success",
        data
    ){
        super(message)
        this.statusCode = statusCode
        this.success = true,
        this.data = data
    }
}

export {ApiResponse}