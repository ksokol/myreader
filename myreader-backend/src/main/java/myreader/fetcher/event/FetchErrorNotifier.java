package myreader.fetcher.event;

import myreader.entity.Feed;
import myreader.entity.FetchError;
import myreader.repository.FeedRepository;
import myreader.repository.FetchErrorRepository;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.Objects;

/**
 * @author Kamill Sokol
 */
@Component
public class FetchErrorNotifier {

    private final FeedRepository feedRepository;
    private final FetchErrorRepository fetchErrorRepository;

    public FetchErrorNotifier(FeedRepository feedRepository, FetchErrorRepository fetchErrorRepository) {
        Objects.requireNonNull(feedRepository, "feedRepository is null");
        Objects.requireNonNull(fetchErrorRepository, "fetchErrorRepository is null");
        this.feedRepository = feedRepository;
        this.fetchErrorRepository = fetchErrorRepository;
    }

    @EventListener
    public void processFetchErrorEvent(FetchErrorEvent event) {
        Feed feed = feedRepository.findByUrl(event.getFeedUrl());

        if(feed != null) {
            FetchError fetchError = new FetchError();
            fetchError.setFeed(feed);
            fetchError.setMessage(event.getErrorMessage());
            fetchError.setCreatedAt(event.getCreatedAt());
            fetchErrorRepository.save(fetchError);
        }
    }
}
