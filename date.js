
exports.getDate = function (){
        //get the current date
        const today = new Date();

        //Object of the weekday
        const options = {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        };
    
        //formats the object toString
        return today.toLocaleDateString("en-US", options);
} 

exports.getDay = function (){
    //get the current date
    const today = new Date();

    //Object of the weekday
    const options = {
        weekday: 'long',
    };

    //formats the object toString
     return today.toLocaleDateString("en-US", options);
} 

