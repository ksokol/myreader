package myreader.fetcher;

import com.rometools.rome.feed.WireFeed;
import myreader.fetcher.persistence.FetchResult;
import myreader.fetcher.sanitizer.Sanitizer;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionService;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.web.client.RestTemplate;

//TODO introduce an interface
/**
 * @author Kamill Sokol
 */
@Service("parser")
public class FeedParser {

    private static final Logger LOG = LoggerFactory.getLogger(FeedParser.class);

    private final RestTemplate syndicationRestTemplate;
    private final ConversionService conversionService;

    @Autowired
    public FeedParser(final RestTemplate syndicationRestTemplate, final ConversionService conversionService) {
        Assert.notNull(syndicationRestTemplate, "syndicationRestTemplate is null");
        Assert.notNull(conversionService, "conversionService is null");
        this.conversionService = conversionService;
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
            final ResponseEntity<WireFeed> responseEntity = syndicationRestTemplate.exchange(feedUrl, HttpMethod.GET, objectHttpEntity, WireFeed.class);

            if(HttpStatus.NOT_MODIFIED == responseEntity.getStatusCode()) {
                return new FetchResult(feedUrl);
            }

            final FetchResult convert = conversionService.convert(responseEntity.getBody(), FetchResult.class);

            convert.setUrl(feedUrl);
            convert.setLastModified(responseEntity.getHeaders().getFirst(HttpHeaders.LAST_MODIFIED));

            Sanitizer.sanitize(convert);

            return convert;
        } catch (Exception e) {
            LOG.warn("url: {}, message: {}", feedUrl, e.getMessage());
            throw new FeedParseException(e.getMessage(), e);
        }
    }
}
