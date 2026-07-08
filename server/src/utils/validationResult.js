function success(data = {}){
    return{
        success: true,
        ...data,
    };
}

function fail(message){
    return {
        success: false,
        message,
    }
}

module.exports = { success, fail }




