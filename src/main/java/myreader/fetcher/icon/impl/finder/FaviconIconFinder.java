package myreader.fetcher.icon.impl.finder;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.net.HttpURLConnection;
import java.util.List;

import myreader.fetcher.icon.IconResult;
import myreader.fetcher.icon.impl.HttpURLConnectionHelper;
import myreader.fetcher.icon.impl.IconConverter;
import myreader.fetcher.icon.impl.IconFinder;

import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
class FaviconIconFinder implements IconFinder {

    private static final String FAVICON = "/favicon.ico";

    @Autowired
    private List<IconConverter> converters;

    @Override
    public IconResult find(String url) {
        IconResult result = null;
        HttpURLConnection urlc = null;

        url = url + FAVICON;

        try {
            urlc = HttpURLConnectionHelper.getHttpURLConnection(url);

            if (urlc.getResponseCode() == 200) {
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                IOUtils.copy(urlc.getInputStream(), baos);

                for (IconConverter converter : converters) {
                    result = converter.convert(new ByteArrayInputStream(baos.toByteArray()));

                    if (result != null) {
                        break;
                    }
                }
            }
        } catch (Exception e) {
        } finally {
            if (urlc != null) {
                urlc.disconnect();
            }
        }

        return result;
    }

    @Override
    public int getOrder() {
        return 100;
    }

}
