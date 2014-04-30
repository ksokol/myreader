package myreader.service.feed;

import myreader.entity.Feed;
import myreader.fetcher.FeedParser;
import myreader.fetcher.impl.FetchResult;
import myreader.repository.FeedRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.feed.AtomFeedHttpMessageConverter;
import org.springframework.http.converter.xml.MarshallingHttpMessageConverter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;

/**
 * @author Kamill Sokol
 */
@Transactional
@Service
public class FeedServiceImpl implements FeedService {

    private final FeedRepository feedRepository;
    private final FeedParser feedParser;

    @Autowired
    public FeedServiceImpl(FeedRepository feedRepository, FeedParser feedParser) {
        this.feedRepository = feedRepository;
        this.feedParser = feedParser;
    }

    @Override
    public Feed createFromUrl(String url) {

        RestTemplate restTemplate = new RestTemplate();


        AtomFeedHttpMessageConverter atomFeedHttpMessageConverter = new AtomFeedHttpMessageConverter();
        MarshallingHttpMessageConverter marshallingHttpMessageConverter = new MarshallingHttpMessageConverter();

        ArrayList<HttpMessageConverter<?>> httpMessageConverters = new ArrayList<HttpMessageConverter<?>>();

        httpMessageConverters.add(atomFeedHttpMessageConverter);
        httpMessageConverters.add(marshallingHttpMessageConverter);

        restTemplate.setMessageConverters(httpMessageConverters);

        com.sun.syndication.feed.atom.Feed forObject = restTemplate.getForObject(url, com.sun.syndication.feed.atom.Feed.class);

        String title = forObject.getTitle();

        System.out.println("------------------------ the title: " + title);

        return null;
    }

    @Override
    public Feed findByUrl(String url) {
        Feed feed = feedRepository.findByUrl(url);

        if(feed == null) {
            FetchResult parseResult = feedParser.parse(url);

            feed = new Feed();
            feed.setUrl(url);
            feed.setTitle(parseResult.getTitle());
            feed = feedRepository.save(feed);
        }

        return feed;
    }
}
