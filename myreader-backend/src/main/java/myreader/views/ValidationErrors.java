package myreader.views;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ValidationErrors {

  private final List<ValidationError> errors = new ArrayList<>(5);

  public void rejectValue(String field, String message) {
    errors.add(new ValidationError(field, message));
  }

  public void throwIfContainsError() {
    if (!errors.isEmpty()) {
      throw new ValidationException(errors);
    }
  }

  public static class ValidationError {
    public final String field;
    public final String defaultMessage;

    ValidationError(String field, String defaultMessage) {
      this.field = field;
      this.defaultMessage = defaultMessage;
    }
  }

  public static class ValidationException extends RuntimeException {

    static final long serialVersionUID = 1L;

    public final transient List<ValidationError> errors;

    ValidationException(List<ValidationError> errors) {
      this.errors = Collections.unmodifiableList(errors);
    }
  }
}


