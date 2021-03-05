package myreader.fetcher;

import java.util.regex.Pattern;

class ExclusionChecker {

  boolean isExcluded(String exclusion, String... matchAgainst) {
    var pattern = Pattern.compile(exclusion, Pattern.CASE_INSENSITIVE | Pattern.DOTALL);

    for (var against : matchAgainst) {
      if (against != null) {
        var matcher = pattern.matcher(against);

        if (matcher.matches()) {
          return true;
        }
      }
    }

    return false;
  }
}
