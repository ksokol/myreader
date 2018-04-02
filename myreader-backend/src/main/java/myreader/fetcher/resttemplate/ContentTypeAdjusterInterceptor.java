package myreader.fetcher.resttemplate;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpRequest;
import org.springframework.http.MediaType;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;

import java.io.IOException;
import java.nio.charset.Charset;
import java.util.List;
import java.util.Objects;

import static org.springframework.http.MediaType.APPLICATION_OCTET_STREAM;

/**
 * @author Kamill Sokol
 */
class ContentTypeAdjusterInterceptor implements ClientHttpRequestInterceptor {

    private static final MediaType RSS_MEDIA_TYPE = new MediaType("application", "rss+xml", Charset.forName("UTF-8"));
    private static final MediaType ATOM_MEDIA_TYPE = new MediaType("application", "atom+xml", Charset.forName("UTF-8"));

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

        if (contentType == null && hasRssFileExtensionInUri) {
            httpHeaders.setContentType(constructContentTypeFromFileExtension(request));
        } else if (hasRssFileExtensionInUri && !matchesRssContentType) {
            httpHeaders.setContentType(constructContentTypeFromContentType(contentType));
        } else {
            httpHeaders.setContentType(contentTypeOrDefault(contentType));
        }
    }

    private MediaType constructContentTypeFromFileExtension(HttpRequest request) {
        String rawPath = request.getURI().getRawPath();
        return rawPath.endsWith(".rss") ? RSS_MEDIA_TYPE : ATOM_MEDIA_TYPE;
    }

    private MediaType constructContentTypeFromContentType(MediaType contentType) {
        MediaType mediaType = RSS_MEDIA_TYPE;
        if (contentType.getCharset() != null) {
            mediaType = new MediaType(mediaType.getType(), mediaType.getSubtype(), contentType.getCharset());
        }
        return mediaType;
    }

    private MediaType contentTypeOrDefault(MediaType contentType) {
        return contentType == null ? APPLICATION_OCTET_STREAM : contentType;
    }

    private boolean hasRssFileExtensionInUri(HttpRequest request) {
        String rawPath = request.getURI().getRawPath();
        return rawPath.endsWith(".rss") || rawPath.endsWith(".atom");
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
