package myreader.fetcher;

import myreader.fetcher.persistence.FetchResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;

@Component
public class FeedQueue {

    private static final Logger LOG = LoggerFactory.getLogger(FeedQueue.class);

    private final Queue<FetchResult> queue = new ConcurrentLinkedQueue<>();

    public void add(FetchResult fetchResult) {
        if (!queue.contains(fetchResult))
            queue.add(fetchResult);
    }

    public int getSize() {
        return queue.size();
    }

    public FetchResult poll() {
        FetchResult fetchResult = queue.poll();
        LOG.debug("left in queue: {}", queue.size());
        return fetchResult;
    }

    public List<String> getSnapshot() {
        final List<String> snapshots = new ArrayList<>();
        for (final FetchResult fetchResult : queue) {
            snapshots.add(fetchResult.getUrl());
        }
        return snapshots;
    }
}
