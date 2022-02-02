const LVIV_TIMEZONE = "Europe/Uzhgorod";

export function getCurrentUADate() {
    const offset = new Date().getTimezoneOffset() * 60000;
    const date = new Date(Date.now() + offset + getTimezoneOffset(LVIV_TIMEZONE));
    return date;
}

const getTimezoneOffset = (timeZone, date = new Date()) => {
    const tz = date.toLocaleString("en", { timeZone, timeStyle: "long" }).split(" ").slice(-1)[0];
    const dateString = date.toString();
    const offset = Date.parse(`${dateString} UTC`) - Date.parse(`${dateString} ${tz}`);

    // return UTC offset in millis
    return offset;
}
