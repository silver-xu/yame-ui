const msIn = {
    week: 1000 * 60 * 60 * 24 * 7,
    day: 1000 * 60 * 60 * 24,
    hour: 1000 * 60 * 60,
    minute: 1000 * 60,
    second: 1000
};

const getDifferenceInMs = (date1: Date, date2: Date): number => {
    const date1InMs = date1.getTime();
    const date2InMs = date2.getTime();

    const diffInMs = date1InMs - date2InMs;
    return diffInMs;
};

const pluralize = (num: number, word: string): string => {
    if (num > 1) {
        return word + 's';
    }
    return word;
};

export interface IDateDifference {
    weeks: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export const getDateDifference = (
    date1: Date,
    date2: Date
): IDateDifference => {
    const differenceInMs = getDifferenceInMs(date1, date2);
    const weeks = Math.floor(differenceInMs / msIn.week);
    const days = Math.floor((differenceInMs % msIn.week) / msIn.day);
    const hours = Math.floor((differenceInMs % msIn.day) / msIn.hour);
    const minutes = Math.floor((differenceInMs % msIn.hour) / msIn.minute);
    const seconds = Math.floor((differenceInMs % msIn.minute) / msIn.second);

    return {
        weeks,
        days,
        hours,
        minutes,
        seconds
    };
};

export const getShortFriendlyDateDifference = (
    date1: Date,
    date2: Date
): string => {
    const dateDifference = getDateDifference(date1, date2);
    if (dateDifference.weeks) {
        return `${dateDifference.weeks} ${pluralize(
            dateDifference.weeks,
            'week'
        )}`;
    } else if (dateDifference.days) {
        return `${dateDifference.days} ${pluralize(
            dateDifference.days,
            'day'
        )}`;
    } else if (dateDifference.hours) {
        return `${dateDifference.hours} ${pluralize(
            dateDifference.hours,
            'hour'
        )}`;
    } else if (dateDifference.minutes) {
        return `${dateDifference.minutes} ${pluralize(
            dateDifference.minutes,
            'min'
        )}`;
    } else {
        return `${dateDifference.seconds} ${pluralize(
            dateDifference.seconds,
            'sec'
        )}`;
    }
};
