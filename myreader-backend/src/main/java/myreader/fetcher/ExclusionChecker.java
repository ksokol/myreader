package myreader.fetcher;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.regex.Pattern;

class ExclusionChecker {

  private static final int PATTERN_FLAGS = Pattern.CASE_INSENSITIVE | Pattern.DOTALL | Pattern.UNICODE_CASE;
  private static final int MAX_ENTRIES = 1000;

  private static final Map<String, Pattern> PATTERN_CACHE = Collections.synchronizedMap(new LinkedHashMap<>(MAX_ENTRIES + 1, .75F, true) {
    public boolean removeEldestEntry(Map.Entry eldest) {
      return size() > MAX_ENTRIES;
    }
  });

  boolean isExcluded(String exclusion, String... matchAgainst) {
    var pattern = PATTERN_CACHE.computeIfAbsent(exclusion, (key) -> {
      var regexp = ".*" + Pattern.quote(exclusion) + ".*";
      return Pattern.compile(regexp, PATTERN_FLAGS);
    });

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
