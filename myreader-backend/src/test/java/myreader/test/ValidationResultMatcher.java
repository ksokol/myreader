package myreader.test;

import myreader.views.ValidationErrors;
import org.springframework.test.web.servlet.ResultMatcher;
import org.springframework.validation.BindException;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.function.Consumer;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class ValidationResultMatcher {

  private final String field;

  public ValidationResultMatcher(String field) {
    this.field = Objects.requireNonNull(field, "field is null");
  }

  public ResultMatcher value(String value) {
    return extractException(errors -> {
      if (errors.containsKey(field)) {
        assertEquals(errors.get(field), value, String.format("field %s", field));
      } else {
        throw new AssertionError(String.format("field %s not present", field));
      }
    });
  }

  private static ResultMatcher extractException(Consumer<Map<String, String>> consumer) {
    return result -> {
      if (result.getResolvedException() instanceof BindException) {
        var exception = (BindException) result.getResolvedException();
        var errors = new HashMap<String, String>();
        exception.getFieldErrors()
          .forEach(fieldError -> errors.put(fieldError.getField(), fieldError.getDefaultMessage()));
        consumer.accept(errors);
      } else if (result.getResolvedException() instanceof ValidationErrors.ValidationException) {
        var exception = (ValidationErrors.ValidationException) result.getResolvedException();
        var errors = new HashMap<String, String>();
        exception.errors
          .forEach(fieldError -> errors.put(fieldError.field, fieldError.defaultMessage));
        consumer.accept(errors);
      } else {
        throw new AssertionError("validation messages not present");
      }
    };
  }
}
