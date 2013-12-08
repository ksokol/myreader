package myreader.fetcher.icon.impl;

import java.net.HttpURLConnection;
import java.util.Arrays;
import java.util.Iterator;
import java.util.LinkedList;

import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

public class DomainIterator implements Iterator<String> {

    private static final int ITERATION_LIMIT = 10;

    private String scheme;
    private LinkedList<String[]> domainsForIteration = new LinkedList<String[]>();
    private String nextIteration;
    private LinkedList<String> iteratorMemory = new LinkedList<String>();

    public DomainIterator(String url) {
        UriComponents build = UriComponentsBuilder.fromUriString(url).build();

        this.scheme = build.getScheme();
        this.domainsForIteration.add(build.getHost().split("\\."));
        this.iteratorMemory.add(url);
        this.nextIteration = url;
    }

    private String reduce(String[] domainParts) {
        String tmp = this.scheme + "://";
        for (String part : domainParts) {
            tmp += part + ".";
        }
        return tmp.substring(0, tmp.length() - 1);
    }

    private String check(String url) {
        HttpURLConnection urlc = null;

        try {
            urlc = HttpURLConnectionHelper.getHttpURLConnection(url);
            urlc.setInstanceFollowRedirects(false);

            if (urlc.getResponseCode() == 302 || urlc.getResponseCode() == 301) {
                String headerField = urlc.getHeaderField("Location");

                String tld1 = getTLD(headerField);
                String tld2 = getTLD(url);

                if (tld1.contains(tld2)) {
                    UriComponents build = UriComponentsBuilder.fromUriString(headerField).build();

                    if (iteratorMemory.contains(headerField)) {
                        return build.getScheme() + "://" + build.getHost();
                    } else {
                        this.domainsForIteration.add(build.getHost().split("\\."));
                        return headerField;
                    }
                } else {
                    return url;
                }
            }
        } catch (Exception e) {
        } finally {
            if (urlc != null) {
                urlc.disconnect();
            }
        }

        return url;
    }

    private String getTLD(String url) {
        UriComponents build = UriComponentsBuilder.fromUriString(url).build();
        String[] split = build.getHost().split("\\.");
        String tld = split[split.length - 2] + "." + split[split.length - 1];
        return build.getScheme() + "://" + tld;
    }

    @Override
    public boolean hasNext() {
        if (iteratorMemory.size() == ITERATION_LIMIT) {
            return false;
        }

        if (this.nextIteration != null) {
            return true;
        }

        for (int i = 0; i < this.domainsForIteration.size(); i++) {
            String[] domainParts = this.domainsForIteration.get(i);

            if (domainParts.length > 1) {
                String reducedDomain = reduce(domainParts);
                String checkedDomain = check(reducedDomain);

                this.domainsForIteration.set(i, Arrays.copyOfRange(domainParts, 1, domainParts.length));

                if (checkedDomain != null && !iteratorMemory.contains(checkedDomain)) {
                    iteratorMemory.add(checkedDomain);
                    this.nextIteration = checkedDomain;
                    return true;
                } else {
                    return hasNext();
                }
            }
        }

        return false;
    }

    @Override
    public String next() {
        String tmp = nextIteration;
        this.nextIteration = null;
        return tmp;
    }

    @Override
    public void remove() {
        throw new UnsupportedOperationException();
    }
}
