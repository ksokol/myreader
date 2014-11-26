package myreader.resource.exception.handler;

/**
 * @author Kamill Sokol
 */
class Error {
    private final int status;
    private final String message;

    Error(int status, String message) {
        this.status = status;
        this.message = message;
    }

    public int getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }
}
