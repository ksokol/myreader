package myreader.service.subscriptionentry;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class SubscriptionEntrySearchQuery {

    private int rows = 10; //default
    private boolean showAll = false; //default
    private String q;
    private Long lastId;
    private Date offset;

    //TODO
    private Map<String, String> filter = new HashMap<String, String>();

    private String orderBy = "createdAt"; //default
    private String sortMode = "desc"; //default

    public void addFilter(String k, String v) {
        if (k == null || v == null) throw new IllegalArgumentException();
        this.filter.put(k, v);
    }

    public int getRows() {
        return rows;
    }

    public void setRows(int rows) {
        this.rows = rows;
    }

    public boolean isShowAll() {
        return showAll;
    }

    public void setShowAll(boolean showAll) {
        this.showAll = showAll;
    }

    public String getQ() {
        return q;
    }

    public void setQ(String q) {
        this.q = q;
    }

    public Long getLastId() {
        return lastId;
    }

    public void setLastId(Long lastId) {
        this.lastId = lastId;
    }

    public Date getOffset() {
        return offset;
    }

    public void setOffset(Date offset) {
        this.offset = offset;
    }

    public String getOrderBy() {
        return orderBy;
    }

    public void setOrderBy(String orderBy) {
        this.orderBy = orderBy;
    }

    public String getSortMode() {
        return sortMode;
    }

    public void setSortMode(String sortMode) {
        this.sortMode = sortMode;
    }

    public Map<String, String> getFilter() {
        return filter;
    }

}
