package myreader.fetcher.converter;

import myreader.fetcher.persistence.FetchResult;

import org.springframework.http.ResponseEntity;

import com.rometools.rome.feed.WireFeed;
import com.rometools.rome.feed.atom.Feed;
import com.rometools.rome.feed.rss.Channel;
import org.springframework.util.Assert;

/**
 * @author Kamill Sokol
 */
public final class WireFeedConverter {

    private static final int MAX_SIZE = 10;

    private final AtomConverter atomConverter = new AtomConverter(MAX_SIZE);
    private final ChannelConverter channelConverter = new ChannelConverter(MAX_SIZE);

    public FetchResult convert(final String feedUrl, ResponseEntity<? extends WireFeed> responseEntity) {
        Assert.notNull(responseEntity, "responseEntity is null");
        final WireFeed body = responseEntity.getBody();
        Assert.notNull(body, "responseEntity.body is null");

        if (body instanceof Channel) {
            return channelConverter.convert(feedUrl, (ResponseEntity<Channel>) responseEntity);
        }

        if (body instanceof Feed) {
            return atomConverter.convert(feedUrl, (ResponseEntity<Feed>) responseEntity);
        }

        throw new IllegalArgumentException("no converter for " + body.getClass());
    }
}
