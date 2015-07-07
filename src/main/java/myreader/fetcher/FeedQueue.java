package myreader.fetcher;

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

    private final Queue<String> queue = new ConcurrentLinkedQueue<>();

    public void add(String f) {
        if (!queue.contains(f))
            queue.add(f);
    }

    public int getSize() {
        return queue.size();
    }

    public String poll() {
        String url = queue.poll();
        LOG.debug("left in queue: {}", queue.size());
        return url;
    }

    public List<String> getSnapshot() {
        final List<String> snapshots = new ArrayList<>();
        for (final String entry : queue) {
            snapshots.add(entry);
        }
        return snapshots;
    }
}
