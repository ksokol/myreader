package myreader.fetcher.impl;

import com.netflix.hystrix.HystrixCommand;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import myreader.fetcher.FeedParser;
import myreader.fetcher.persistence.FetchResult;
import org.springframework.util.Assert;

/**
 * @author Kamill Sokol
 */
public class HystrixFeedParser implements FeedParser {

    private final FeedParser feedParser;

    public HystrixFeedParser(FeedParser feedParser) {
        Assert.notNull(feedParser, "feedParser is null");
        this.feedParser = feedParser;
    }

    @Override
    public FetchResult parse(String feedUrl) {
        return parse(feedUrl, null);
    }

    @Override
    public FetchResult parse(String feedUrl, String lastModified) {
        final FeedParserHystrixCommand command = new FeedParserHystrixCommand(feedUrl, lastModified);
        return command.execute();
    }

    private class FeedParserHystrixCommand extends HystrixCommand<FetchResult> {

        private static final String DEFAULT = "default";

        private final String feedUrl;
        private final String lastModified;

        FeedParserHystrixCommand(String feedUrl, String lastModified) {
            super(HystrixCommand.Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey(DEFAULT)).andCommandKey(HystrixCommandKey.Factory.asKey(feedUrl)));
            this.feedUrl = feedUrl;
            this.lastModified = lastModified;
        }

        @Override
        protected FetchResult run() throws Exception {
            return HystrixFeedParser.this.feedParser.parse(feedUrl, lastModified);
        }

        @Override
        protected FetchResult getFallback() {
            return new FetchResult(feedUrl);
        }
    }
}
