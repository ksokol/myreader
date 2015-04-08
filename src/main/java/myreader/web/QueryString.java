package myreader.web;

import java.util.concurrent.ConcurrentHashMap;

@Deprecated
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

            for (final Entry<String, Object> entry : super.entrySet()) {
                sb.append(entry.getKey());
                sb.append("=");
                sb.append(entry.getValue());
                sb.append("&");
            }

            sb.deleteCharAt(sb.length() - 1);
        }

        return sb.toString();
    }

}
