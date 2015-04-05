package myreader.web;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

public class QueryString extends ConcurrentHashMap<String, Object> {

    private static final long serialVersionUID = 1L;

    public boolean has(String key) {
        return (super.get(key) != null) ? true : false;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();

        if (this.size() > 0) {
            sb.append("?");
            final Set<String> strings = this.keySet();

            for (String key : strings) {
                Object value = this.get(key);

                sb.append(key);
                sb.append("=");
                sb.append(value);
                sb.append("&");
            }

            sb.deleteCharAt(sb.length() - 1);
        }

        return sb.toString();
    }

}
