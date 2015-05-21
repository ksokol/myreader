package myreader.resource.common;

import java.util.Map;
import java.util.TreeMap;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;

/**
 * @author Kamill Sokol
 */
public class Content<T> {

    @NotNull
    private T content;

    private Map<String, Object> additional = new TreeMap<>();

    public Content() {
        //empty on purpose
    }

    public Content(T content) {
        this.content = content;
    }

    public T getContent() {
        return content;
    }

    public void setContent(final T content) {
        this.content = content;
    }

    public void add(String key, Object value) {
        additional.put(key, value);
    }

    @JsonAnyGetter
    public Map<String, Object> getAdditional() {
        return additional;
    }

    @JsonAnySetter
    public void setAdditional(final Map<String, Object> additional) {
        this.additional = additional;
    }
}
