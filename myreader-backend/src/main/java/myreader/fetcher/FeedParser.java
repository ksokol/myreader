package myreader.fetcher;

import com.rometools.rome.feed.WireFeed;
import myreader.fetcher.converter.WireFeedConverter;
import myreader.fetcher.persistence.FetchResult;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

import static java.util.Objects.requireNonNull;
import static org.springframework.http.HttpHeaders.IF_MODIFIED_SINCE;
import static org.springframework.http.HttpStatus.NOT_MODIFIED;

@Component
public class FeedParser {

  private final RestTemplate syndicationRestTemplate;
  private final WireFeedConverter wireFeedConverter = new WireFeedConverter();

  public FeedParser(RestTemplate syndicationRestTemplate) {
    this.syndicationRestTemplate = requireNonNull(syndicationRestTemplate, "syndicationRestTemplate is null");
  }

  public Optional<FetchResult> parse(String feedUrl) {
    return parse(feedUrl, null);
  }

  public Optional<FetchResult> parse(String feedUrl, String lastModified) {
    try {
      var httpHeaders = new HttpHeaders();

      if (StringUtils.isNotBlank(lastModified)) {
        httpHeaders.add(IF_MODIFIED_SINCE, lastModified);
      }

      var httpEntity = new HttpEntity<>(httpHeaders);
      var responseEntity = syndicationRestTemplate.exchange(feedUrl, HttpMethod.GET, httpEntity, WireFeed.class);

      if (NOT_MODIFIED == responseEntity.getStatusCode() || responseEntity.getBody() == null) {
        return Optional.empty();
      }

      return Optional.of(wireFeedConverter.convert(feedUrl, responseEntity));
    } catch (Exception exception) {
      throw new FeedParseException(exception.getMessage(), exception);
    }
  }
}
