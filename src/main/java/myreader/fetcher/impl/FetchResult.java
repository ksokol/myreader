package myreader.fetcher.impl;

import myreader.fetcher.persistence.FetcherEntry;

import java.util.ArrayList;
import java.util.List;

public class FetchResult {

    private List<FetcherEntry> entries;
    private String lastModified;
    private String title;

    public FetchResult() {
        this.entries = new ArrayList<FetcherEntry>();
        this.lastModified = "";
        this.title = "";
    }

    public FetchResult(List<FetcherEntry> entries, String lastModified, String title) {
        this.entries = entries;
        this.lastModified = lastModified;
        this.title = title;
    }

    public List<FetcherEntry> getEntries() {
        return entries;
    }

    public void setEntries(List<FetcherEntry> entries) {
        this.entries = entries;
    }

    public String getLastModified() {
        return lastModified;
    }

    public String getTitle() {
        return title;
    }
}
