package myreader.fetcher;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

class ExclusionChecker {

    public boolean isExcluded(String exclusion, String... matchAgainst) {
        final Pattern pattern = Pattern.compile(exclusion, Pattern.CASE_INSENSITIVE);

        for (String against : matchAgainst) {
            if (against != null) {
                Matcher matcher = pattern.matcher(against);

                if (matcher.matches()) {
                    return true;
                }
            }
        }

        return false;
    }

}
