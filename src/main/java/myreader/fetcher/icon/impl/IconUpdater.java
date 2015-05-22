package myreader.fetcher.icon.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import myreader.entity.Feed;
import myreader.entity.FeedIcon;
import myreader.fetcher.icon.IconResult;
import myreader.fetcher.icon.IconService;
import myreader.repository.FeedRepository;

@Transactional(propagation = Propagation.REQUIRES_NEW)
@Component
public class IconUpdater {

    private static final Logger LOG = LoggerFactory.getLogger(IconUpdater.class);

    @Autowired
    private FeedRepository feedRepository;

    @Autowired
    private IconService iconService;

    public void updateIcon(String url) {
        LOG.info("start IconUpdateJob for {}", url);

        Feed feed = feedRepository.findByUrl(url);

        if (feed == null) {
            LOG.info("no feed for url found {} - skipping", url);
            return;
        }

        IconResult result = iconService.findByUrl(url);

        FeedIcon fi = new FeedIcon();
        fi.setMimeType(result.getMimeType());
        fi.setIcon(result.asDataUrl());

        feed = feedRepository.findByUrl(url);

        if (feed == null) {
            LOG.info("no feed for url found {} - skipping", url);
            return;
        }

        feed.setIcon(fi);
        feedRepository.save(feed);

        LOG.info("end IconUpdateJob for {}", url);
    }
}
