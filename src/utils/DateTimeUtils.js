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
    if (isEmptyOrUndefined(json)) {
        return "";
    }
    let myDate = new Date(json);
    let hour = myDate.getHours();
    let minute = myDate.getMinutes();
    let second = myDate.getSeconds();
    const seconds = String(second).padStart(2, '0');
    const minutes = String(minute).padStart(2, '0');
    switch (language) {
        case "en":
            return `${hour}:${minutes}:${seconds}`;
        case "fi":
            return `klo ${hour}.${minutes}.${seconds}`;
        default:
            return "";
    }
}

function getDateString(json, language = "en") {
    if (isEmptyOrUndefined(json)) {
        return "";
    }
    let myDate = new Date(json);
    let date = myDate.getDate();
    let month = myDate.getMonth() + 1;
    let year = myDate.getFullYear();

    switch (language) {
        case "en":
            return `${year}-${month < 10 ? `0${month}` : `${month}`}-${date < 10 ? `0${date}` : `${date}`}`;
        case "fi":
            return `${date}.${month}.${year}`;
        default:
            return "";
    }
}

function getDateTimeString(json, language = "en") {
    if (isEmptyOrUndefined(json)) {
        return "";
    }
    let dateStr = getDateString(json, language);
    let timeString = getTimeString(json, language);
    return `${dateStr} ${timeString}`;
}

function isEmptyOrUndefined(json) {
    if (json === "" || json === undefined)
        return true;

    return false;
}