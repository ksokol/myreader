package myreader.test;

import org.springframework.test.web.servlet.ResultMatcher;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.Objects;
import java.util.function.Consumer;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class ValidationResultMatcher {

  private final String field;

  public ValidationResultMatcher(String field) {
    this.field = Objects.requireNonNull(field, "field is null");
  }

  public ResultMatcher value(String value) {
    return extractException(exception -> {
      BindingResult bindingResult = exception.getBindingResult();
      FieldError fieldError = bindingResult.getFieldError(field);

      if (fieldError != null) {
        assertEquals(fieldError.getDefaultMessage(), value, String.format("field %s", field));
      } else {
        throw new AssertionError(String.format("field %s not present", field));
      }
    });
  }

  private static ResultMatcher extractException(Consumer<MethodArgumentNotValidException> consumer) {
    return result -> {
      if (result.getResolvedException() instanceof MethodArgumentNotValidException) {
        consumer.accept((MethodArgumentNotValidException) result.getResolvedException());
      } else {
        throw new AssertionError("validation messages not present");
      }
    };
  }
}
