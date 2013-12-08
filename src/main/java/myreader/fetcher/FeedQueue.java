package myreader.fetcher;

import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component("feedQueue")
public class FeedQueue {

    private Logger logger = LoggerFactory.getLogger(getClass());

    private Queue<String> queue = new ConcurrentLinkedQueue<String>();

    public void add(String f) {
        if (!queue.contains(f))
            queue.add(f);
    }

    public int getSize() {
        return queue.size();
    }

    public String poll() {
        String url = queue.poll();
        logger.debug("left in queue: {}", queue.size());

        return url;
    }

    public Object[] getQueued()
    {
        return queue.toArray();
    }
}
