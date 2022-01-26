package myreader.fetcher.converter;

import com.rometools.rome.feed.atom.Content;
import com.rometools.rome.feed.atom.Entry;
import com.rometools.rome.feed.atom.Feed;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Answers;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.Collections;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.BDDMockito.given;
import static org.springframework.http.HttpStatus.OK;

@ExtendWith(MockitoExtension.class)
class AtomConverterTests {

  @Mock
  private Feed feed;

  @Mock(answer = Answers.RETURNS_DEEP_STUBS)
  private Entry entry;

  @Mock
  private Content content;

  @Test
  void noContent() {
    given(entry.getAlternateLinks().get(0).getHref()).willReturn("http://localhost");
    given(feed.getEntries()).willReturn(Collections.singletonList(entry));

    given(entry.getContents()).willReturn(Collections.singletonList(content));
    given(content.getValue()).willReturn(null);

    var actual = new AtomConverter(10).convert("http://localhost", new ResponseEntity<>(feed, OK));

    assertThat(actual.getEntries().get(0).getContent(false)).isEmpty();
  }

  @Test
  void invalidConstructorArgument() {
    assertThrows(IllegalArgumentException.class, () -> new AtomConverter(-1), "maxSize has to be greater than 0");
  }

  @Test
  void maxSize() {
    given(feed.getEntries()).willReturn(Arrays.asList(entry, entry));

    var actual = new AtomConverter(1).convert("", new ResponseEntity<>(feed, OK));

    assertThat(actual.getEntries()).hasSize(1);
    assertThat(actual.getResultSizePerFetch()).isEqualTo(2);
  }
}
