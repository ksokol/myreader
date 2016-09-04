package myreader.fetcher.resttemplate;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpRequest;
import org.springframework.http.MediaType;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;

import java.io.IOException;
import java.util.List;
import java.util.Objects;

/**
 * @author Kamill Sokol
 */
class ContentTypeAdjusterInterceptor implements ClientHttpRequestInterceptor {

    private static final MediaType RSS_MEDIA_TYPE = new MediaType("application", "rss+xml");

    private final List<MediaType> supportedTypes;

    ContentTypeAdjusterInterceptor(List<MediaType> supportedTypes) {
        Objects.requireNonNull(supportedTypes, "supportedTypes is null");
        this.supportedTypes = supportedTypes;
    }

    @Override
    public ClientHttpResponse intercept(HttpRequest request, byte[] body, ClientHttpRequestExecution execution) throws IOException {
        ClientHttpResponse response = execution.execute(request, body);

        adjustContentTypeIfNecessary(request, response.getHeaders());

        return response;
    }

    private void adjustContentTypeIfNecessary(HttpRequest request, HttpHeaders httpHeaders) {
        MediaType contentType = httpHeaders.getContentType();

        boolean hasRssFileExtensionInUri = hasRssFileExtensionInUri(request);
        boolean matchesRssContentType = matchesRssContentType(contentType);

        if(hasRssFileExtensionInUri && !matchesRssContentType) {
            httpHeaders.setContentType(constructRssContentType(contentType));
        }
    }

    private MediaType constructRssContentType(MediaType contentType) {
        MediaType mediaType = RSS_MEDIA_TYPE;
        if (contentType.getCharset() != null) {
            mediaType = new MediaType(mediaType.getType(), mediaType.getSubtype(), contentType.getCharset());
        }
        return mediaType;
    }

    private boolean hasRssFileExtensionInUri(HttpRequest request) {
        return request.getURI().getRawPath().endsWith(".rss");
    }

    private boolean matchesRssContentType(MediaType contentType) {
        for (MediaType supportedMediaType : supportedTypes) {
            if(supportedMediaType.isCompatibleWith(contentType)) {
                return true;
            }
        }
        return false;
    }
}
