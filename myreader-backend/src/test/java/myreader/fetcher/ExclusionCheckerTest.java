package myreader.fetcher;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ExclusionCheckerTest {

  private static final ExclusionChecker exclusionChecker = new ExclusionChecker();

  @Test
  void shouldExcludeKeywordInParam() {
    assertThat(exclusionChecker.isExcluded("word2", "word1 word2 word3", "word4 word5 word6"))
      .isTrue();

    assertThat(exclusionChecker.isExcluded("word5", "word1 word2 word3", "word4 word5 word6"))
      .isTrue();
  }

  @Test
  void shouldExcludeWithWhitespace() {
    assertThat(exclusionChecker.isExcluded("word 1", "word 1 word 2"))
      .isTrue();

    assertThat(exclusionChecker.isExcluded("word 3", "word 1 word 2"))
      .isFalse();
  }

  @Test
  void shouldExcludeWithBackslash() {
    assertThat(exclusionChecker.isExcluded("word\\ 1", "word\\ 1"))
      .isTrue();

    assertThat(exclusionChecker.isExcluded("word\\ 1", "word\\\\ 1"))
      .isFalse();
  }

  @Test
  void shouldExcludeWithRegexCharacters() {
    assertThat(exclusionChecker.isExcluded("word ? 1", "word ? 1"))
      .isTrue();

    assertThat(exclusionChecker.isExcluded("word ? 1", "word a 1"))
      .isFalse();
  }

  @Test
  void shouldNotExcludeKeywordWithWhitespace() {
    assertThat(exclusionChecker.isExcluded("word 1", "word 3 word 4"))
      .isFalse();

    assertThat(exclusionChecker.isExcluded("word 1", "word 1 word 2"))
      .isTrue();
  }

  @Test
  void shouldNotFailOnNullParams() {
    assertThat(exclusionChecker.isExcluded("word1"))
      .isFalse();

    assertThat(exclusionChecker.isExcluded("word1", null, null))
      .isFalse();
  }

  @Test
  void shouldExcludeKeywordInMultilineString() {
    assertThat(exclusionChecker.isExcluded("word1", "line1 \r\nline2 word1 text\nline3"))
      .isTrue();
  }
}
