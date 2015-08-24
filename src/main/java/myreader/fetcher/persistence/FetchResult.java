package myreader.fetcher.persistence;

import java.util.Collections;
import java.util.List;

/**
 * @author Kamill Sokol
 */
public class FetchResult {

    private final List<FetcherEntry> entries;
    private final String title;
    private String lastModified;
    private String url;

    public FetchResult(String url) {
        this(Collections.<FetcherEntry>emptyList(), null, null);
        setUrl(url);
    }

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

    public String getUrl() {
        return url;
    }

    public void setUrl(final String url) {
        this.url = url;
    }

    @Override
    public boolean equals(final Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        final FetchResult that = (FetchResult) o;
        return url.equals(that.url);

    }

    @Override
    public int hashCode() {
        return url.hashCode();
    }
}
