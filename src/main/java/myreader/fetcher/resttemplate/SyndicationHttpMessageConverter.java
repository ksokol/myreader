package myreader.fetcher.resttemplate;

import static org.springframework.http.MediaType.ALL;
import static org.springframework.http.MediaType.APPLICATION_ATOM_XML;
import static org.springframework.http.MediaType.APPLICATION_XML;
import static org.springframework.http.MediaType.TEXT_XML;

import com.rometools.rome.feed.WireFeed;
import org.springframework.http.MediaType;
import org.springframework.http.converter.feed.AbstractWireFeedHttpMessageConverter;

import java.util.Arrays;

/**
 * @author Kamill Sokol
 */
class SyndicationHttpMessageConverter extends AbstractWireFeedHttpMessageConverter<WireFeed> {

    public SyndicationHttpMessageConverter() {
        super(ALL);
        setSupportedMediaTypes(Arrays.asList(TEXT_XML, APPLICATION_ATOM_XML, APPLICATION_XML, new MediaType("application", "rss+xml"), new MediaType("application", "rss+atom")));
    }

    @Override
    protected boolean supports(final Class<?> clazz) {
        return WireFeed.class.isAssignableFrom(clazz);
    }
}
