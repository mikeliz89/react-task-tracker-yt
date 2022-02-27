/** Get current date as Json datetime */
export function getCurrentDateAsJson() {
    let newDate = new Date();
    return newDate.toJSON();
}

/** Get only time part from Json datetime */
export function getJsonAsTimeString(json, language) {
    return getTimeString(json, language);
}

/** Get only date part from Json datetime */
export function getJsonAsDateString(json, language) {
    return getDateString(json, language);
}

/** Get both date and time parts from Json datetime */
export function getJsonAsDateTimeString(json, language) {
    return getDateTimeString(json, language);
}

function getTimeString(json, language = "en") {
     //empty or undefined
     if(json == "" || json == undefined) {
        return "";
    }
    let myDate = new Date(json);
    let hour = myDate.getHours();
    let minute = myDate.getMinutes();
    let second = myDate.getSeconds();
    switch (language) {
        case "en":
            return `${hour}:${minute}:${second}`;
        case "fi":
            return `klo ${hour}.${minute}.${second}`;
    }
    return "";
}

function getDateString(json, language = "en") {
    //empty or undefined
    if(json == "" || json == undefined) {
        return "";
    }
    let myDate = new Date(json);
    let date = myDate.getDate();
    let month = myDate.getMonth() + 1;
    let year = myDate.getFullYear();

    switch(language) {
        case "en":
            return `${year}-${month<10?`0${month}`:`${month}`}-${date}`;
        case "fi":
            return `${date}.${month}.${year}`;
    }
    return "";
}

function getDateTimeString(json, language = "en") {
    //empty or undefined
    if(json == "" || json == undefined) {
        return "";
    }
    let dateStr = getDateString(json, language);
    let timeString = getTimeString(json, language); 
    return `${dateStr} ${timeString}`;
}