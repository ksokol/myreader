package myreader.fetcher.impl;

import myreader.fetcher.FeedQueue;
import myreader.fetcher.persistence.FetchResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;

@Component
public class FeedQueueImpl implements FeedQueue {

    private static final Logger LOG = LoggerFactory.getLogger(FeedQueueImpl.class);

    private final Queue<FetchResult> queue = new ConcurrentLinkedQueue<>();

    @Override
    public void add(FetchResult fetchResult) {
        if (!queue.contains(fetchResult))
            queue.add(fetchResult);
    }

    @Override
    public int getSize() {
        return queue.size();
    }

    @Override
    public FetchResult poll() {
        FetchResult fetchResult = queue.poll();
        LOG.debug("left in queue: {}", queue.size());
        return fetchResult;
    }

    @Override
    public List<String> getSnapshot() {
        final List<String> snapshots = new ArrayList<>();
        for (final FetchResult fetchResult : queue) {
            snapshots.add(fetchResult.getUrl());
        }
        return snapshots;
    }
}
