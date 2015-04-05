package myreader.web.taglib;

import java.text.MessageFormat;
import java.util.Date;

public class TimeAgoFunction {

    private static final String PREFIX_AGO = null;
    private static final String PREFIX_FROM_NOW = null;
    private static final String SUFFIX_AGO = "ago";
    private static final String SUFFIX_FROM_NOW = "from now";
    private static final String SECOND = "less than a minute";
    private static final String MINUTE = "about a minute";
    private static final String MINUTES = "{0} minutes";
    private static final String HOUR = "about an hour";
    private static final String HOURS = "{0} hours";
    private static final String DAY = "a day";
    private static final String DAYS = "{0} days";
    private static final String MONTH = "about a month";
    private static final String MONTHS = "{0} months";
    private static final String YEAR = "about a year";
    private static final String YEARS = "{0} years";

    /**
     * Get time ago that date occurred
     * 
     * @param date
     * @return time string
     */
    public static String format(Date date) {
        return format(date.getTime());
    }

    /**
     * Get time ago that milliseconds date occurred
     * 
     * @param millis
     * @return time string
     */
    public static String format(long millis) {
        return time(System.currentTimeMillis() - millis, false);
    }

    /**
     * Get time string for milliseconds distance
     * 
     * @param distanceMillis
     * @param allowFuture
     * @return time string
     */
    private static String time(long distanceMillis, boolean allowFuture) {
        String time = null;

        String prefix = PREFIX_AGO;
        String suffix = SUFFIX_AGO;

        if (allowFuture) {
            if (distanceMillis < 0) {
                prefix = PREFIX_FROM_NOW;
                suffix = SUFFIX_FROM_NOW;
            }
            distanceMillis = Math.abs(distanceMillis);
        }

        double seconds = distanceMillis / 1000;
        double minutes = seconds / 60;
        double hours = minutes / 60;
        double days = hours / 24;
        double years = days / 365;

        if (seconds < 45)
            time = SECOND;
        else if (seconds < 90)
            time = MINUTE;
        else if (minutes < 45)
            time = MessageFormat.format(MINUTES, Math.round(minutes));
        else if (minutes < 90)
            time = HOUR;
        else if (hours < 24)
            time = MessageFormat.format(HOURS, Math.round(hours));
        else if (hours < 48)
            time = DAY;
        else if (days < 30)
            time = MessageFormat.format(DAYS, Math.floor(days));
        else if (days < 60)
            time = MONTH;
        else if (days < 365)
            time = MessageFormat.format(MONTHS, Math.floor(days / 30));
        else if (years < 2)
            time = YEAR;
        else
            time = MessageFormat.format(YEARS, Math.floor(years));

        return join(prefix, time, suffix);
    }

    /**
     * Join time string with prefix and suffix. The prefix and suffix are only
     * joined with the time if they are non-null and non-empty
     * 
     * @param prefix
     * @param time
     * @param suffix
     * @return non-null joined string
     */
    private static String join(String prefix, String time, String suffix) {
        StringBuilder joined = new StringBuilder();
        if (prefix != null && prefix.length() > 0)
            joined.append(prefix).append(' ');
        joined.append(time);
        if (suffix != null && suffix.length() > 0)
            joined.append(' ').append(suffix);
        return joined.toString();
    }
}
