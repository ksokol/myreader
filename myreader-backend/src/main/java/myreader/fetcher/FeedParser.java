package myreader.fetcher;

import com.rometools.rome.feed.WireFeed;
import myreader.fetcher.converter.WireFeedConverter;
import myreader.fetcher.event.FetchErrorEvent;
import myreader.fetcher.persistence.FetchResult;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

import static java.util.Objects.requireNonNull;

/**
 * @author Kamill Sokol
 */
@Component
public class FeedParser {

    private static final Logger LOG = LoggerFactory.getLogger(FeedParser.class);

    private final RestTemplate syndicationRestTemplate;
    private final ApplicationEventPublisher eventPublisher;
    private final WireFeedConverter wireFeedConverter = new WireFeedConverter();

    public FeedParser(final RestTemplate syndicationRestTemplate, ApplicationEventPublisher eventPublisher) {
        this.syndicationRestTemplate = requireNonNull(syndicationRestTemplate, "syndicationRestTemplate is null");
        this.eventPublisher = requireNonNull(eventPublisher, "eventPublisher is null");
    }

    public Optional<FetchResult> parse(String feedUrl) {
        return parse(feedUrl, null);
    }

    public Optional<FetchResult> parse(String feedUrl, String lastModified) {
        try {
            final HttpHeaders httpHeaders = new HttpHeaders();

            if(StringUtils.isNotBlank(lastModified)) {
                httpHeaders.add("If-Modified-Since", lastModified);
            }

            final HttpEntity<Void> objectHttpEntity = new HttpEntity<>(httpHeaders);
            final ResponseEntity<? extends WireFeed> responseEntity = syndicationRestTemplate.exchange(feedUrl, HttpMethod.GET, objectHttpEntity, WireFeed.class);

            if(HttpStatus.NOT_MODIFIED == responseEntity.getStatusCode()) {
                return Optional.empty();
            }

            if(responseEntity.getBody() == null) {
                return Optional.empty();
            }

            return Optional.of(wireFeedConverter.convert(feedUrl, responseEntity));
        } catch (Exception e) {
            LOG.error("url: {}, message: {}", feedUrl, e.getMessage());
            eventPublisher.publishEvent(new FetchErrorEvent(feedUrl, e.getMessage()));
            throw new FeedParseException(e.getMessage(), e);
        }
    }
}
