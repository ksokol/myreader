package myreader.fetcher.converter;

import com.rometools.rome.feed.rss.Channel;
import com.rometools.rome.feed.rss.Item;
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
public class ChannelConverterTests {

  @Mock
  private Item item;

  @Mock(answer = Answers.RETURNS_DEEP_STUBS)
  private Channel channel;

  @Test
  void noDescription() {
    given(item.getLink()).willReturn("http://localhost");
    given(channel.getItems()).willReturn(Collections.singletonList(item));
    given(item.getDescription()).willReturn(null);

    var actual = new ChannelConverter(10).convert("http://localhost", new ResponseEntity<>(channel, OK));

    assertThat(actual.getEntries().get(0).getContent(false)).isEmpty();
  }

  @Test
  void invalidConstructorArgument() {
    assertThrows(IllegalArgumentException.class, () -> new ChannelConverter(-1), "maxSize has to be greater than 0");
  }

  @Test
  void maxSize() {
    given(channel.getItems()).willReturn(Arrays.asList(item, item));

    var actual = new ChannelConverter(1).convert("http://localhost", new ResponseEntity<>(channel, OK));

    assertThat(actual.getEntries()).hasSize(1);
    assertThat(actual.getResultSizePerFetch()).isEqualTo(2);
  }
}
