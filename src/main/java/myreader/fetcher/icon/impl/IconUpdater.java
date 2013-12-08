package myreader.fetcher.icon.impl;

import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.List;

import javax.imageio.ImageIO;

import myreader.dao.FeedDao;
import myreader.entity.Feed;
import myreader.entity.FeedIcon;
import myreader.fetcher.icon.IconResult;
import myreader.fetcher.icon.IconService;
import myreader.fetcher.icon.IconUpdateRequestEvent;

import org.apache.commons.codec.binary.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class IconUpdater implements ApplicationListener<IconUpdateRequestEvent> {

    private Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    private FeedDao feedDao;

    @Autowired
    private IconService iconService;

    @Override
    public void onApplicationEvent(IconUpdateRequestEvent event) {
        if (event.getUrl() == null) {
            start();
        } else {
            updateIcon(event.getUrl());
        }
    }

    public void start() {
        List<String> feedUrls = getFeedUrls();

        for (String url : feedUrls) {
            updateIcon(url);
        }
    }

    public void updateIcon(String url) {
        logger.info("start IconUpdateJob for {}", url);

        IconResult result = iconService.findByUrl(url);
        BufferedImage converted = scale(result.getIcon());

        FeedIcon fi = new FeedIcon();
        fi.setMimeType(result.getMimeType());
        fi.setIcon(toBase64(converted, result.getMimeType()));

        save(url, fi);
        logger.info("end IconUpdateJob for {}", url);
    }

    @Transactional
    private void save(String url, FeedIcon icon) {
        Feed feed = feedDao.findByUrl(url);

        if (feed != null) {
            feed.setIcon(icon);
            feedDao.saveOrUpdate(feed);
        }
    }

    private BufferedImage scale(BufferedImage bi) {
        BufferedImage bufferedImage = new BufferedImage(16, 16, BufferedImage.TYPE_INT_ARGB);
        Graphics2D createGraphics = bufferedImage.createGraphics();
        createGraphics.drawImage(bi, 0, 0, 16, 16, 0, 0, bi.getWidth(), bi.getHeight(), null);
        return bufferedImage;
    }

    private String toBase64(BufferedImage bi, String mimetype) {
        String encoded = null;
        String ext = "png";

        // TODO
        if (mimetype.contains("bmp")) {
            ext = "bmp";
        }

        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(bi, ext, baos);
            encoded = Base64.encodeBase64URLSafeString(baos.toByteArray());
        } catch (Exception e) {
        }

        return encoded;
    }

    @Transactional
    private List<String> getFeedUrls() {
        List<Feed> feedList = feedDao.findAll();
        List<String> stringList = new ArrayList<String>();

        for (Feed feed : feedList) {
            stringList.add(feed.getUrl());
        }

        return stringList;
    }
}
