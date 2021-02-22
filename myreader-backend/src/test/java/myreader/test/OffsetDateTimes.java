package myreader.test;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

public class OffsetDateTimes {

  private OffsetDateTimes() {
    // prevent instantiation
  }

  public static OffsetDateTime ofEpochMilli(long epochMilli) {
    return OffsetDateTime.ofInstant(Instant.ofEpochMilli(epochMilli), ZoneOffset.UTC);
  }
}
