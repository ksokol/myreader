package myreader.test;

import org.hamcrest.Matcher;
import org.springframework.test.web.servlet.ResultMatcher;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.function.Consumer;

import static org.junit.Assert.assertThat;

public final class CustomMockMvcResultMatchers {

  private CustomMockMvcResultMatchers() {
    // prevent instantiation
  }

  public static CustomMockMvcResultMatchers validation() {
    return new CustomMockMvcResultMatchers();
  }

  /**
   * @deprecated Use {@link #onField(String)} instead.
   */
  @Deprecated
  public ResultMatcher onField(String field, Matcher<String> matcher) {
    return extractException(exception -> {
      BindingResult bindingResult = exception.getBindingResult();
      FieldError fieldError = bindingResult.getFieldError(field);

      if (fieldError != null) {
        assertThat(String.format("field %s", field), fieldError.getDefaultMessage(), matcher);
      } else {
        throw new AssertionError(String.format("field %s not present", field));
      }
    });
  }

  public ValidationResultMatcher onField(String field) {
    return new ValidationResultMatcher(field);
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
