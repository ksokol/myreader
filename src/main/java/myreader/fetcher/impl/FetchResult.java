package myreader.fetcher.impl;

import java.util.ArrayList;
import java.util.List;

import myreader.fetcher.persistence.FetcherEntry;

public class FetchResult {

    private List<FetcherEntry> entries;
    private String lastModified;

    public FetchResult() {
        this.entries = new ArrayList<FetcherEntry>();
        this.lastModified = "";
    }

    public FetchResult(List<FetcherEntry> entries, String lastModified) {
        this.entries = entries;
        this.lastModified = lastModified;
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

    public void setLastModified(String lastModified) {
        this.lastModified = lastModified;
    }

}
