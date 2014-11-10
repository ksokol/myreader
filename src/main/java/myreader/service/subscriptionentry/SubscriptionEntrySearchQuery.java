package myreader.service.subscriptionentry;

import java.util.List;

/**
 * @author Kamill Sokol
 */
@Deprecated
public class SubscriptionEntrySearchQuery {

    private int rows = 10; //default
    private boolean showAll = false; //default
    private String q;
    private Long lastId;
    private List<Long> feedId;
    private String tag;
    private String feedTitle;

	@Deprecated
    public int getRows() {
        return rows;
    }

	@Deprecated
    public void setRows(int rows) {
        this.rows = rows;
    }

	@Deprecated
    public boolean isShowAll() {
        return showAll;
    }

	@Deprecated
    public void setShowAll(boolean showAll) {
        this.showAll = showAll;
    }

	@Deprecated
    public String getQ() {
        return q;
    }

	@Deprecated
    public void setQ(String q) {
        this.q = q;
    }

	@Deprecated
    public Long getLastId() {
        return lastId;
    }

	@Deprecated
    public void setLastId(Long lastId) {
        this.lastId = lastId;
    }

	@Deprecated
    public List<Long> getFeedId() {
        return feedId;
    }

	@Deprecated
    public void setFeedId(List<Long> feedId) {
        this.feedId = feedId;
    }

	@Deprecated
    public String getTag() {
        return tag;
    }

	@Deprecated
    public void setTag(String tag) {
        this.tag = tag;
    }

    public String getFeedTitle() {
        return feedTitle;
    }

    public void setFeedTitle(String feedTitle) {
        this.feedTitle = feedTitle;
    }
}
