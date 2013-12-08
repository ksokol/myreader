package myreader.subscription.web;

import java.util.HashMap;
import java.util.Map;

public class ValidationException extends RuntimeException {

    private static final long serialVersionUID = 8961579631797984194L;

    private Map<String, Object> messages = new HashMap<String, Object>();

    public ValidationException(String key, Object value) {
        this.messages.put(key, value);
    }

    public void addMessage(String key, Object message) {
        this.messages.put(key, message);
    }

    public Map<String, Object> getMessages() {
        return messages;
    }

}
