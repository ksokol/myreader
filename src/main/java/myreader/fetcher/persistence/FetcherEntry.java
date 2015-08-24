package myreader.fetcher.persistence;

import myreader.fetcher.sanitizer.EntryLinkSanitizer;
import myreader.fetcher.sanitizer.StringDecoder;

/**
 * @author Kamill Sokol
 */
public class FetcherEntry {

    private String title;
    private String titleSanitized;
    private String guid;
    private String url;
    private String feedUrl;
    private String urlSanitized;
    private String content;
    private String contentSanitized;

    public String getTitle() {
        if(titleSanitized == null) {
            titleSanitized = StringDecoder.escapeSimpleHtml(title);
        }
        return titleSanitized;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getGuid() {
        return guid;
    }

    public void setGuid(String guid) {
        this.guid = guid;
    }

    public String getUrl() {
        if(urlSanitized == null) {
            urlSanitized = EntryLinkSanitizer.sanitize(url, feedUrl);
        }
        return urlSanitized;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public void setFeedUrl(final String feedUrl) {
        this.feedUrl = feedUrl;
    }

    public String getContent() {
        if(contentSanitized == null) {
            contentSanitized = StringDecoder.escapeHtmlContent(content, getUrl());
        }
        return contentSanitized;
    }

    public void setContent(String content) {
        this.content = content;
    }

}
