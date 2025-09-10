// All functions expect date strings in 'YYYY-MM-DD' format.

/**
 * Parses a 'YYYY-MM-DD' string into a Date object in the user's local timezone.
 * This approach avoids UTC conversion issues that can cause off-by-one-day errors.
 * @param dateStr The date string to parse.
 * @returns A Date object.
 */
export const parseDate = (dateStr: string): Date => {
    if (!dateStr) return new Date(NaN); // Return invalid date for empty string
    const [year, month, day] = dateStr.split('-').map(Number);
    // new Date(year, monthIndex, day) creates a date in the local timezone.
    return new Date(year, month - 1, day);
};

export const yearsBetween = (earlyDateStr: string, lateDateStr: string): number => {
    if (!earlyDateStr || !lateDateStr) return 0;
    const earlyDate = parseDate(earlyDateStr);
    const lateDate = parseDate(lateDateStr);
    let years = lateDate.getFullYear() - earlyDate.getFullYear();
    const earlyMonth = earlyDate.getMonth();
    const lateMonth = lateDate.getMonth();
    const earlyDay = earlyDate.getDate();
    const lateDay = lateDate.getDate();

    if (lateMonth < earlyMonth || (lateMonth === earlyMonth && lateDay < earlyDay)) {
        years--;
    }
    return Math.max(0, years);
};

export const yearsToToday = (dateStr: string): number => {
    if (!dateStr) return 0;
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return yearsBetween(dateStr, todayStr);
};

export const yearsToTodayFloat = (dateStr: string): number => {
    if (!dateStr) return 0;
    const startDate = parseDate(dateStr);
    const endDate = new Date();
    const diff = endDate.getTime() - startDate.getTime();
    return diff / (1000 * 60 * 60 * 24 * 365.25);
};


export const monthsBetween = (earlyDateStr: string, lateDateStr: string): number => {
    if (!earlyDateStr || !lateDateStr) return 0;
    const earlyDate = parseDate(earlyDateStr);
    const lateDate = parseDate(lateDateStr);

    let months = (lateDate.getFullYear() - earlyDate.getFullYear()) * 12;
    months -= earlyDate.getMonth();
    months += lateDate.getMonth();

    if (lateDate.getDate() < earlyDate.getDate()) {
        months--;
    }
    return months <= 0 ? 0 : months;
};


export const monthsToToday = (dateStr: string): number => {
    if (!dateStr) return 0;
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return monthsBetween(dateStr, todayStr);
};

export const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return 'N/A';
    // The input format is YYYY-MM-DD. We construct the date this way to avoid timezone issues.
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    // Using en-GB format DD/MM/YYYY
    return new Intl.DateTimeFormat('en-GB').format(date);
};
