package myreader.fetcher.event;

import org.springframework.context.ApplicationEvent;

import java.util.Date;

/**
 * @author Kamill Sokol
 */
public class FetchErrorEvent extends ApplicationEvent {

    private static final long serialVersionUID = 1;

    private String errorMessage;

    public FetchErrorEvent(Object source, String errorMessage) {
        super(source);
        this.errorMessage = errorMessage;
    }

    public String getFeedUrl() {
        return getSource().toString();
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public Date getCreatedAt() {
        return new Date(getTimestamp());
    }
}
