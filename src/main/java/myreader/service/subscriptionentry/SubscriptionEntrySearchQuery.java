package myreader.service.subscriptionentry;

import java.util.Date;
import java.util.List;

public class SubscriptionEntrySearchQuery {

    private int rows = 10; //default
    private boolean showAll = false; //default
    private String q;
    private Long lastId;
    private List<Long> feedId;
    private String tag;

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

    public List<Long> getFeedId() {
        return feedId;
    }

    public void setFeedId(List<Long> feedId) {
        this.feedId = feedId;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }
}
