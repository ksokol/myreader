package myreader.service.subscriptionentry.impl;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

class ExclusionChecker {

    public boolean isExcluded(String exclusion, String... matchAgainst) {
        if (matchAgainst == null) {
            return false;
        }

        Pattern p = Pattern.compile(exclusion, Pattern.CASE_INSENSITIVE);

        for (String against : matchAgainst) {
            if (against != null) {
                Matcher matcher = p.matcher(against);

                if (matcher.matches()) {
                    return true;
                }
            }
        }

        return false;
    }

}
