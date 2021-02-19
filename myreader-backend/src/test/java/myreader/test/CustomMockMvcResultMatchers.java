package myreader.test;

public final class CustomMockMvcResultMatchers {

  private CustomMockMvcResultMatchers() {
    // prevent instantiation
  }

  public static CustomMockMvcResultMatchers validation() {
    return new CustomMockMvcResultMatchers();
  }

  public ValidationResultMatcher onField(String field) {
    return new ValidationResultMatcher(field);
  }
}
