class ErrorHandler  {
    constructor (status,message){
        this.status = status || 500;
        this.message = message;
    }

}

function handleError (err,req,res,next) {
    const {status,message} = err ;
    console.log('[ERROR] : '+ err.status)
   return res.status(status).json({
        status : "Error",
        Code : status,
        message : message ,
    })

}

module.exports = {
    ErrorHandler,
    handleError
}