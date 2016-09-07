package myreader.resource.feed.assembler;

import myreader.entity.Feed;
import myreader.repository.FetchErrorRepository;
import myreader.resource.feed.beans.FeedGetResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import spring.hateoas.ResourceAssemblerSupport;

import java.time.Clock;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Date;

/**
 * @author Kamill Sokol
 */
@Component
public class FeedGetResponseAssemblerSupport extends ResourceAssemblerSupport<Feed, FeedGetResponse> {

    private final FetchErrorRepository fetchErrorRepository;
    private final Clock clock;
    private final int retainDays;

    public FeedGetResponseAssemblerSupport(FetchErrorRepository fetchErrorRepository, Clock clock, @Value("${job.fetchError.retainInDays}") int retainDays) {
        super(Feed.class, FeedGetResponse.class);
        this.fetchErrorRepository = fetchErrorRepository;
        this.clock = clock;
        this.retainDays = retainDays;
    }

    @Override
    public FeedGetResponse toResource(Feed source) {
        FeedGetResponse target = new FeedGetResponse();

        target.setUuid(source.getId().toString());
        target.setTitle(source.getTitle());
        target.setUrl(source.getUrl());
        target.setFetched(source.getFetched());
        target.setLastModified(source.getLastModified());
        target.setHasErrors(fetchErrorRepository.countByFeedIdAndCreatedAtGreaterThan(source.getId(), fromNowMinusRetainDays()) > 0);
        target.setCreatedAt(source.getCreatedAt());

        return target;
    }

    private Date fromNowMinusRetainDays() {
        return Date.from(LocalDateTime.now(clock).minusDays(retainDays).toInstant(ZoneOffset.UTC));
    }
}
