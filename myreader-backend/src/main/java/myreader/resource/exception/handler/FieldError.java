package myreader.resource.exception.handler;

/**
 * @author Kamill Sokol
 */
class FieldError {
    private String field;
    private String message;

    public FieldError(String field, String message) {
        this.field = field;
        this.message = message;
    }

    public String getField() {
        return field;
    }

    public String getMessage() {
        return message;
    }
}
