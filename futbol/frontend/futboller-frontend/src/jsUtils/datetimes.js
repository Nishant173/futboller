export function getCurrentUTCDate() {
    const currentUTCDate = new Date()
    return currentUTCDate
}


export function getCurrentTZDate() {
    const currentUTCDate = getCurrentUTCDate()
    const timezoneOffset = currentUTCDate.getTimezoneOffset()
    const currentTZDate = new Date(currentUTCDate.getTime() - timezoneOffset * 60000)
    return currentTZDate
}


export function getCurrentTZDateString() {
    const currentUTCDate = getCurrentUTCDate()
    const currentTZDateString = dateObjToCleanString(currentUTCDate)
    return currentTZDateString
}


export function getDayOfWeekMapper() {
    return {
        0: "Sunday",
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday",
    }
}


export function getMonthMapper() {
    return {
        1: "January",
        2: "February",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "December",
    }
}


export function getDatePropertiesObj(dateObj) {
    let dayOfWeekMapper = getDayOfWeekMapper()
    let monthMapper = getMonthMapper()
    return {
        dayOfWeek: dayOfWeekMapper[dateObj.getDay()],
        monthName: monthMapper[dateObj.getMonth() + 1],
        date: dateObj.getDate(),
        month: dateObj.getMonth() + 1,
        year: dateObj.getFullYear(),
        hours: dateObj.getHours(),
        minutes: dateObj.getMinutes(),
        seconds: dateObj.getSeconds(),
    }
}


// Adds '0' prefix if stringified number given is single digit number
function addZeroPrefixIfSingleDigit(stringifiedNumber) {
    if (stringifiedNumber.length === 1) {
        return `0${stringifiedNumber}`
    }
    return stringifiedNumber
}


export function dateObjToCleanString(dateObj, includeTime=true) {
    const dateProps = getDatePropertiesObj(dateObj)
    let year = addZeroPrefixIfSingleDigit(dateProps.year.toString())
    let month = addZeroPrefixIfSingleDigit(dateProps.month.toString())
    let date = addZeroPrefixIfSingleDigit(dateProps.date.toString())
    const theDateString = `${year}-${month}-${date}`
    if (includeTime) {
        let hours = dateProps.hours
        let amOrPm = "AM"
        if (hours >= 12) {
            amOrPm = "PM"
            hours -= 12
        }
        if (hours === 0) {
            hours = 12
        }
        hours = addZeroPrefixIfSingleDigit(hours.toString())
        let minutes = addZeroPrefixIfSingleDigit(dateProps.minutes.toString())
        let seconds = addZeroPrefixIfSingleDigit(dateProps.seconds.toString())
        const theTimeString = `${hours}:${minutes}:${seconds} ${amOrPm}`
        return `${theDateString} ${theTimeString}`    
    }
    return `${theDateString}`
}


// Returns date string of format: "yyyy-mm-dd"
export function momentObjToString(momentObj) {
    let dateObj = new Date(momentObj)
    let yyyy = `${dateObj.getFullYear()}`
    let mm = `${dateObj.getMonth() + 1}`
    let dd = `${dateObj.getDate()}`
    if (mm.length === 1) {
      mm = '0' + mm
    }
    if (dd.length === 1) {
      dd = '0' + dd
    }
    return `${yyyy}-${mm}-${dd}`
}


// Returns month group string of format: "<year> <fullMonthName>"
export function momentObjToMonthGroupVerbose(momentObj) {
    let dateObj = new Date(momentObj)
    const year = `${dateObj.getFullYear()}`
    const monthNumber = dateObj.getMonth() + 1
    const monthNumberToName = getMonthMapper()
    const monthName = monthNumberToName[monthNumber]
    return `${year} ${monthName}`
}