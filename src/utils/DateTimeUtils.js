import { Languages } from "../Languages";

/** Get current date as Json datetime */
export function getCurrentDateAsJson() {
    let newDate = new Date();
    return newDate.toJSON();
}

/** Get current date */
export function getCurrentDate() {
    const date = new Date();
    //set default date to current date
    return date.toLocaleDateString('en-CA');
}

/** Get current time */
export function getCurrentTime() {
    const date = new Date();
    return date.toTimeString().split(' ')[0];
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

export function getDateAndTimeAsDateTimeString(date, time, language) {

    let hasNoTime = false;
    if (time === "") {
        time = "00:00";
        hasNoTime = true;
    }

    const jsonDate = date + 'T' + time + ':00.000Z';
    const datePart = getDateString(jsonDate, language);

    if (hasNoTime) {
        return datePart;
    }
    const timePart = getTimeString(jsonDate, language);
    return datePart + ' ' + timePart;
}

function getTimeString(json, language = Languages.EN) {
    if (isEmptyOrUndefined(json)) {
        return "";
    }
    const myDate = new Date(json);
    const hour = myDate.getHours();
    const minute = myDate.getMinutes();
    const second = myDate.getSeconds();
    const seconds = String(second).padStart(2, '0');
    const minutes = String(minute).padStart(2, '0');
    switch (language) {
        case Languages.EN:
            return `${hour}:${minutes}:${seconds}`;
        case Languages.FI:
            return `klo ${hour}.${minutes}.${seconds}`;
        default:
            return "";
    }
}

function getDateString(json, language = Languages.EN) {
    if (isEmptyOrUndefined(json)) {
        return "";
    }
    const myDate = new Date(json);
    const date = myDate.getDate();
    const month = myDate.getMonth() + 1;
    const year = myDate.getFullYear();

    switch (language) {
        case Languages.EN:
            return `${year}-${month < 10 ? `0${month}` : `${month}`}-${date < 10 ? `0${date}` : `${date}`}`;
        case Languages.FI:
            return `${date}.${month}.${year}`;
        default:
            return "";
    }
}

function getDateTimeString(json, language = Languages.EN) {
    if (isEmptyOrUndefined(json)) {
        return "";
    }
    const dateStr = getDateString(json, language);
    const timeString = getTimeString(json, language);
    return `${dateStr} ${timeString}`;
}

function isEmptyOrUndefined(json) {
    if (json === "" || json === undefined) {
        return true;
    }
    return false;
}