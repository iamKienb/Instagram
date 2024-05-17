class HttpException extends Error{
    constructor(public statusCode: number, public message:string,){
        super(message)
        this.statusCode = statusCode    
    }

}

export default HttpException;

