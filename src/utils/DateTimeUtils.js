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
    if(isEmptyOrUndefined(json)) {
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
        default:
            return "";
    }
}

function getDateString(json, language = "en") {
    if(isEmptyOrUndefined(json)) {
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
        default: 
            return "";
    }
}

function getDateTimeString(json, language = "en") {
    if(isEmptyOrUndefined(json)) {
        return "";
    }
    let dateStr = getDateString(json, language);
    let timeString = getTimeString(json, language); 
    return `${dateStr} ${timeString}`;
}

function isEmptyOrUndefined(json) {
    if(json === "" || json === undefined)
        return true;

    return false;
}