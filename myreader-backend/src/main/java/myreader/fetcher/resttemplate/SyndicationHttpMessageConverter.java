package myreader.fetcher.resttemplate;

import com.rometools.rome.feed.WireFeed;
import org.springframework.http.MediaType;
import org.springframework.http.converter.feed.AbstractWireFeedHttpMessageConverter;

import java.util.List;

import static org.springframework.http.MediaType.ALL;

/**
 * @author Kamill Sokol
 */
class SyndicationHttpMessageConverter extends AbstractWireFeedHttpMessageConverter<WireFeed> {

    public SyndicationHttpMessageConverter(List<MediaType> supportedTypes) {
        super(ALL);
        setSupportedMediaTypes(supportedTypes);
    }

    @Override
    protected boolean supports(final Class<?> clazz) {
        return WireFeed.class.isAssignableFrom(clazz);
    }
}
