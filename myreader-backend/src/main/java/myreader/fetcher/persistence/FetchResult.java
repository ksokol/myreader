package myreader.fetcher.persistence;

import myreader.fetcher.sanitizer.HtmlSanitizer;

import java.util.List;

import static java.util.Collections.emptyList;

/**
 * @author Kamill Sokol
 */
public class FetchResult {

    private final List<FetcherEntry> entries;
    private final String title;
    private String lastModified;
    private String url;
    private int resultSizePerFetch;

    public FetchResult(String url) {
        this(emptyList(), null, null, url, 0);
    }

    public FetchResult(List<FetcherEntry> entries, String lastModified, String title, String url, int resultSizePerFetch) {
        this.entries = entries;
        this.lastModified = lastModified;
        this.title = HtmlSanitizer.sanitizeTitle(title);
        this.url = url;
        this.resultSizePerFetch = resultSizePerFetch;
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

    @Deprecated
    public void setUrl(final String url) {
        this.url = url;
    }

    public int getResultSizePerFetch() {
        return resultSizePerFetch;
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
