package myreader.test;

import org.hamcrest.Matcher;
import org.springframework.test.web.servlet.ResultMatcher;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import static org.junit.Assert.assertThat;

/**
 * @author Kamill Sokol
 */
public final class CustomMockMvcResultMatchers {

    private CustomMockMvcResultMatchers() {
        // prevent instantiation
    }

    public static CustomMockMvcResultMatchers validation() {
        return new CustomMockMvcResultMatchers();
    }

    public ResultMatcher onField(String field, Matcher<String> matcher) {
        return result -> {
            if (result.getResolvedException() instanceof MethodArgumentNotValidException) {
                MethodArgumentNotValidException exception = (MethodArgumentNotValidException) result.getResolvedException();
                BindingResult bindingResult = exception.getBindingResult();
                FieldError fieldError = bindingResult.getFieldError(field);

                if (fieldError != null) {
                    assertThat("field " + field, fieldError.getDefaultMessage(), matcher);
                } else {
                    throw new AssertionError("field " + field + " not present");
                }
            } else {
                throw new AssertionError("validation messages not present");
            }
        };
    }
}
