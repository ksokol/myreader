package myreader.fetcher;

import myreader.fetcher.converter.WireFeedConverter;
import myreader.fetcher.persistence.FetchResult;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;
import org.springframework.web.client.RestTemplate;

import com.rometools.rome.feed.WireFeed;

//TODO introduce an interface
/**
 * @author Kamill Sokol
 */
@Component
public class FeedParser {

    private static final Logger LOG = LoggerFactory.getLogger(FeedParser.class);

    private final RestTemplate syndicationRestTemplate;
    private final WireFeedConverter wireFeedConverter = new WireFeedConverter();

    @Autowired
    public FeedParser(final RestTemplate syndicationRestTemplate) {
        Assert.notNull(syndicationRestTemplate, "syndicationRestTemplate is null");
        this.syndicationRestTemplate = syndicationRestTemplate;
    }

    public FetchResult parse(String feedUrl) {
        return parse(feedUrl, null);
    }

    public FetchResult parse(String feedUrl, String lastModified) {
        try {
            final HttpHeaders httpHeaders = new HttpHeaders();

            if(StringUtils.isNotBlank(lastModified)) {
                httpHeaders.add("If-Modified-Since", lastModified);
            }

            final HttpEntity<Void> objectHttpEntity = new HttpEntity<>(httpHeaders);
            final ResponseEntity<? extends WireFeed> responseEntity = syndicationRestTemplate.exchange(feedUrl, HttpMethod.GET, objectHttpEntity, WireFeed.class);

            if(HttpStatus.NOT_MODIFIED == responseEntity.getStatusCode()) {
                return new FetchResult(feedUrl);
            }

            return wireFeedConverter.convert(feedUrl, responseEntity);
        } catch (Exception e) {
            LOG.warn("url: {}, message: {}", feedUrl, e.getMessage());
            throw new FeedParseException(e.getMessage(), e);
        }
    }
}
