package myreader.fetcher;

import myreader.fetcher.persistence.FetchResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

@Component
public class FeedQueue {

    private static final Logger log = LoggerFactory.getLogger(FeedQueue.class);

    private final BlockingQueue<FetchResult> queue = new LinkedBlockingQueue<>();

    public void add(FetchResult fetchResult) {
        if (!queue.contains(fetchResult)) {
            queue.add(fetchResult);
        }
    }

    public int getSize() {
        return queue.size();
    }

    public FetchResult take() {
        FetchResult fetchResult = queue.poll();
        log.debug("left in queue: {}", queue.size());
        return fetchResult;
    }
}
