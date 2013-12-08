package myreader.fetcher;

public class FeedParseException extends RuntimeException {

    private static final long serialVersionUID = 5411707885603224421L;

    public FeedParseException() {
    }

    public FeedParseException(String message, Exception e) {
        super(message, e);
    }

}
