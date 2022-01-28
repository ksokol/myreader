package myreader.fetcher.sanitizer;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

class EntryLinkSanitizerTest {

  private static final String HTTP_URL = "http://localhost";
  private static final String HTTPS_URL = "https://localhost";

  @Test
  void test1() {
    var sanitized = EntryLinkSanitizer.sanitize("/test", HTTP_URL);

    assertThat(sanitized)
      .isEqualTo(HTTP_URL + "/test");
  }

  @Test
  void test2() {
    var sanitized = EntryLinkSanitizer.sanitize(HTTP_URL + "/test", HTTP_URL);

    assertThat(sanitized)
      .isEqualTo(HTTP_URL + "/test");
  }

  @Test
  void test3() {
    var sanitized = EntryLinkSanitizer.sanitize("test", HTTP_URL);

    assertThat(sanitized)
      .isEqualTo(HTTP_URL + "/test");
  }

  @Test
  void test4() {
    var sanitized = EntryLinkSanitizer.sanitize(HTTPS_URL + "/test", HTTPS_URL);

    assertThat(sanitized)
      .isEqualTo(HTTPS_URL + "/test");
  }

  @Test
  void test5() {
    assertThrows(
      IllegalArgumentException.class,
      () -> EntryLinkSanitizer.sanitize(null, null),
      "entryLink is null"
    );
  }

  @Test
  void test6() {
    assertThrows(
      IllegalArgumentException.class,
      () -> EntryLinkSanitizer.sanitize(HTTPS_URL + "/test", null),
      "feedLink is null"
    );
  }

  @Test
  void test7() {
    assertThrows(
      IllegalArgumentException.class,
      () -> EntryLinkSanitizer.sanitize(null, HTTPS_URL),
      "entryLink is null"
    );
  }

  @Test
  void test8() {
    assertThrows(
      IllegalArgumentException.class,
      () -> EntryLinkSanitizer.sanitize("/test", "test"),
      "feedLink must start with http(s)?://"
    );
  }

  @Test
  void test9() {
    var sanitized = EntryLinkSanitizer.sanitize("test", HTTP_URL);

    assertThat(sanitized)
      .isEqualTo(HTTP_URL + "/test");
  }

  @Test
  void test10() {
    var sanitized = EntryLinkSanitizer.sanitize("/test", HTTP_URL);

    assertThat(sanitized)
      .isEqualTo(HTTP_URL + "/test");
  }

  @Test
  void test11() {
    var sanitized = EntryLinkSanitizer.sanitize("test", HTTP_URL);

    assertThat(sanitized)
      .isEqualTo(HTTP_URL + "/test");
  }

  @Test
  void test12() {
    var sanitized = EntryLinkSanitizer.sanitize("/test", HTTP_URL);

    assertThat(sanitized)
      .isEqualTo(HTTP_URL + "/test");
  }

  @Test
  void test13() {
    var sanitized = EntryLinkSanitizer.sanitize("//sub.example.com/relative", "http://sub.example.com/");

    assertThat(sanitized)
      .isEqualTo("http://sub.example.com/relative");
  }
}
