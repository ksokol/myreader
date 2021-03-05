package myreader.fetcher;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ExclusionCheckerTest {

  private static final ExclusionChecker exclusionChecker = new ExclusionChecker();

  @Test
  void shouldExcludeKeywordInParam1() {
    var param1 = "Free and Open Source PHP Wiki Scripts";
    var param2 = "Unlike many of the Wiki software listed on this page, Dokuwiki does not require you to ...";

    assertThat(exclusionChecker.isExcluded(".*php.*", param1, param2))
      .isTrue();
  }

  @Test
  void shouldExcludeKeywordInParam2() {
    var param1 = "Free and Open Source Wiki Scripts";
    var param2 = "Unlike many of the PHP Wiki software listed on this page, Dokuwiki does not require you to ...";

    assertThat(exclusionChecker.isExcluded(".*php.*", param1, param2))
      .isTrue();
  }

  @Test
  void shouldExcludeWithWhitespace() {
    assertThat(exclusionChecker.isExcluded(".*windows 8.*", "Windows 8: Making VirtualBox and Hyper-V Play Nice"))
      .isTrue();

    assertThat(exclusionChecker.isExcluded(".*windows\\ 8.*", "Windows 8: Making VirtualBox and Hyper-V Play Nice"))
      .isTrue();
  }

  @Test
  void shouldNotExcludeKeywordWithWhitespace() {
    assertThat(exclusionChecker.isExcluded(".*windows phone.*", "Simple Reverse Geocoding - Windows and MVVMLight Phone"))
      .isFalse();
  }

  @Test
  void shouldNotFailOnNullParams() {
    assertThat(exclusionChecker.isExcluded(".*windows phone.*"))
      .isFalse();

    assertThat(exclusionChecker.isExcluded(".*windows phone.*", null, null))
      .isFalse();
  }

  @Test
  void shouldExcludeKeywordInMultilineString() {
    assertThat(exclusionChecker.isExcluded(".*keyword.*", "line1 \r\nline2 keyword text\nline3"))
      .isTrue();
  }
}
