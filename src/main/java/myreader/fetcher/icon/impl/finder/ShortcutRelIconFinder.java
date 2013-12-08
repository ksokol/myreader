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
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

@Component
class ShortcutRelIconFinder implements IconFinder {

    @Autowired
    private List<IconConverter> converters;

    private static final String SELECT = "html head link[rel=icon], html head link[rel=shortcut icon]";

    @Override
    public IconResult find(String url) {
        String icoUrl = null;
        IconResult result = null;

        try {
            Document doc = Jsoup.connect(url).get();
            Elements newsHeadlines = doc.select(SELECT);

            if (newsHeadlines.size() > 0) {
                Element element = newsHeadlines.first();
                String attr = element.attr("href");

                if (attr.startsWith("http")) {
                    icoUrl = attr;
                } else if (attr.startsWith("//")) {
                    // TODO: ?
                    icoUrl = "http:" + attr;
                } else {
                    UriComponentsBuilder fromUriString = UriComponentsBuilder.fromUriString(url);
                    fromUriString.replacePath(attr);
                    UriComponents build = fromUriString.build();
                    icoUrl = build.toUriString();
                }
            }

        } catch (Throwable e) {
        }

        if (icoUrl != null) {
            HttpURLConnection urlc = HttpURLConnectionHelper.getHttpURLConnection(icoUrl);

            try {
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
            } catch (Throwable e) {
            } finally {
                if (urlc != null) {
                    urlc.disconnect();
                }
            }
        }

        return result;
    }

    @Override
    public int getOrder() {
        return 0;
    }

}
