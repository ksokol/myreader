package myreader.fetcher.impl;

import myreader.fetcher.persistence.FetcherEntry;

import java.util.List;

public class FetchResult {

    private List<FetcherEntry> entries;
    private String lastModified;
    private String title;

    public FetchResult(List<FetcherEntry> entries, String lastModified, String title) {
        this.entries = entries;
        this.lastModified = lastModified;
        this.title = title;
    }

    public List<FetcherEntry> getEntries() {
        return entries;
    }

    public String getLastModified() {
        return lastModified;
    }

    public String getTitle() {
        return title;
    }
}
