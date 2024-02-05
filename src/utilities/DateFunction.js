import env from "../configs/env"
import moment from 'moment'

const currYear =  () => {
  return moment().format('YYYY');
}

const currDate =  () => {
    return moment().format('YYYYMMDD');
}

const currDatetime =  () => {
    return moment().format('YYYYMMDDHHmmss');
}

const currTime =  () => {
    return moment().format('HHmmss');
}

const formatDate =  (inputDate) => {
    const year = inputDate.substring(0, 4);
    const month = inputDate.substring(4, 6);
    const day = inputDate.substring(6, 8);
    return `${day}.${month}.${year}`;
}

const formatJsDate =  (inputDate) => {
  const year = inputDate.substring(0, 4);
  const month = inputDate.substring(4, 6);
  const day = inputDate.substring(6, 8);
  return `${year}-${month}-${day}`;
}

const formatDatetime =  (inputDatetime) => {
    const year = inputDatetime.substring(0, 4);
    const month = inputDatetime.substring(4, 6);
    const day = inputDatetime.substring(6, 8);
    const hour = inputDatetime.substring(8, 10);
    const min = inputDatetime.substring(10, 12);
    const sec = inputDatetime.substring(12, 14);
    return `${day}.${month}.${year} ${hour}:${min}:${sec}`;
}

const formatTime =  (inputTime) => {
    const hour = inputTime.substring(0, 2);
    const min = inputTime.substring(2, 4);
    const sec = inputTime.substring(4, 6);
    return `${hour}:${min}:${sec}`;
}

function formatDateToDBFormat(maskedDate) {
    // Prvo, uklonimo svi tačke iz maskedDate kako bismo dobili "18072023"
    const dateWithoutDots = maskedDate.replace(/\./g, '');
  
    // Zatim, izdvojimo dan, mesec i godinu iz "18072023"
    const day = dateWithoutDots.substring(0, 2);
    const month = dateWithoutDots.substring(2, 4);
    const year = dateWithoutDots.substring(4);
  
    // Napravimo format "20230718" i vratimo ga
    return `${year}${month}${day}`;
  }

  function formatDateTimeToDBFormat(dateTimeString) {
    // Prvo, uklonimo sve znakove osim brojeva iz dateTimeString kako bismo dobili "18072023162830"
    const dateTimeWithoutSeparators = dateTimeString.replace(/\D/g, '');
  
    // Zatim, izdvojimo dan, mesec, godinu, sate, minute i sekunde iz "18072023162830"
    const day = dateTimeWithoutSeparators.substring(0, 2);
    const month = dateTimeWithoutSeparators.substring(2, 4);
    const year = dateTimeWithoutSeparators.substring(4, 8);
    const hours = dateTimeWithoutSeparators.substring(8, 10);
    const minutes = dateTimeWithoutSeparators.substring(10, 12);
    const seconds = dateTimeWithoutSeparators.substring(12, 14);
  
    // Napravimo format "20230718162830" i vratimo ga
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }
  
  function formatTimeToDBFormat(timeString) {
    // Prvo, uklonimo sve znakove osim brojeva iz dateTimeString kako bismo dobili "18072023162830"
    const timeWithoutSeparators = timeString.replace(/\D/g, '');
  
    // Zatim, izdvojimo dan, mesec, godinu, sate, minute i sekunde iz "18072023162830"
    const hours = timeWithoutSeparators.substring(0, 2);
    const minutes = timeWithoutSeparators.substring(2, 4);
    const seconds = timeWithoutSeparators.substring(4, 6);
  
    // Napravimo format "162830" i vratimo ga
    return `${hours}${minutes}${seconds}`;
  }

  function dateGetValue(dateTimeString) {
    const selectedDate = dateTimeString;
    const day = selectedDate.getDate().toString().padStart(2, '0');
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = selectedDate.getFullYear().toString();
    
    // Kombinacija dan, mesec i godina u željeni format
    return `${day}.${month}.${year}`;    
  }  

// Convert time from database format (HHmm) to display format (HH:mm)
const convertTimeToDisplayFormat = (time) => {
  if (time && time.length === 4 && /^\d+$/.test(time)) {
    const hours = time.substr(0, 2);
    const minutes = time.substr(2, 2);
    return `${hours}:${minutes}`;
  } else {
    return time; // Return the original input if the format is incorrect
  }
};


// Convert time from display format (HH:mm) to database format (HHmm)
const convertTimeToDBFormat = (time) => {
  const [hours, minutes] = time.split(":");
  if (hours !== undefined && minutes !== undefined) {
    return `${hours}${minutes}`;
  } else {
    return time; // Return the original input if the format is incorrect
  }
};


export default {
    currYear,
    currDate,
    currDatetime,
    currTime,
    formatDate,
    formatJsDate,
    formatDatetime,
    formatTime,
    formatDateToDBFormat,
    formatDateTimeToDBFormat,
    formatTimeToDBFormat,
    dateGetValue,
    convertTimeToDisplayFormat,
    convertTimeToDBFormat,
};