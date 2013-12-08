package myreader.fetcher.icon;

import org.springframework.context.ApplicationEvent;

public class IconUpdateRequestEvent extends ApplicationEvent {

    private static final long serialVersionUID = 1L;

    private String url;

    public IconUpdateRequestEvent(Object source) {
        super(source);
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

}