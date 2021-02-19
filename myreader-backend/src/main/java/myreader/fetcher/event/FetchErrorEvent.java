package myreader.fetcher.event;

import org.springframework.context.ApplicationEvent;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.TimeZone;

public class FetchErrorEvent extends ApplicationEvent {

  private static final long serialVersionUID = 2;

  private final String errorMessage;

  public FetchErrorEvent(Object source, String errorMessage) {
    super(source);
    this.errorMessage = errorMessage;
  }

  public String getFeedUrl() {
    return getSource().toString();
  }

  public String getErrorMessage() {
    return errorMessage;
  }

  public OffsetDateTime getCreatedAt() {
    return OffsetDateTime.ofInstant(Instant.ofEpochMilli(getTimestamp()), TimeZone.getDefault().toZoneId());
  }
}
