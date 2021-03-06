package myreader.fetcher.resttemplate;

import org.apache.commons.io.IOUtils;
import org.apache.commons.io.input.BOMInputStream;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.AbstractClientHttpResponse;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;

import javax.xml.XMLConstants;
import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamException;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.regex.Pattern;

class CleanSyndicationInterceptor implements ClientHttpRequestInterceptor {

  // http://www.rgagnon.com/javadetails/java-sanitize-xml-string.html
  private final Pattern invalidXmlCharacters = Pattern.compile("[^\\u0009\\u000A\\u000D\\u0020-\\uD7FF\\uE000-\\uFFFD\\x{10000}-\\x{10FFFF}]");

  @Override
  public ClientHttpResponse intercept(HttpRequest request, byte[] body, ClientHttpRequestExecution execution) throws IOException {
    try (var execute = execution.execute(request, body)) {
      var bodyInputStream = execute.getBody();

      if (execute.getStatusCode() == HttpStatus.OK) {
        var syndicationInputStream = new SyndicationInputStream(execute.getBody());
        var cleanedBody = invalidXmlCharacters.matcher(syndicationInputStream.asString()).replaceAll("");

        bodyInputStream = new ByteArrayInputStream(cleanedBody.getBytes(StandardCharsets.UTF_8));
      }

      return new WrappedClientHttpResponse(execute, bodyInputStream);
    }
  }
}

class SyndicationInputStream {

  private static final XMLInputFactory factory;

  static {
    factory = XMLInputFactory.newInstance();
    factory.setProperty(XMLConstants.ACCESS_EXTERNAL_DTD, "");
    factory.setProperty(XMLConstants.ACCESS_EXTERNAL_SCHEMA, "");
  }

  private final ByteArrayOutputStream inputStream;

  SyndicationInputStream(InputStream inputStream) throws IOException {
    this.inputStream = new ByteArrayOutputStream();
    inputStream.transferTo(this.inputStream);
  }

  String asString() throws IOException {
    return IOUtils.toString(copy(), charset());
  }

  private InputStream copy() {
    return new BOMInputStream(new ByteArrayInputStream(inputStream.toByteArray()));
  }

  private String charset() {
    try {
      return factory.createXMLStreamReader(copy()).getEncoding();
    } catch (XMLStreamException exception) {
      throw new IllegalArgumentException(exception.getMessage(), exception);
    }
  }
}

class WrappedClientHttpResponse extends AbstractClientHttpResponse {

  private final ClientHttpResponse execute;
  private final InputStream body;

  WrappedClientHttpResponse(ClientHttpResponse execute, InputStream body) {
    this.execute = execute;
    this.body = body;
  }

  @Override
  public HttpHeaders getHeaders() {
    return execute.getHeaders();
  }

  @Override
  public InputStream getBody() {
    return body;
  }

  @Override
  public int getRawStatusCode() throws IOException {
    return execute.getRawStatusCode();
  }

  @Override
  public String getStatusText() throws IOException {
    return execute.getStatusText();
  }

  @Override
  public void close() {
    execute.close();
  }
}
