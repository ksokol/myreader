package myreader.entity;

import java.util.Date;

public class FeedEntryQuery {

    private Long feedIdFilter;
    private Date createdAtFilter;

    public Long getFeedIdFilter() {
        return feedIdFilter;
    }

    public void setFeedIdFilter(Long feedIdFilter) {
        this.feedIdFilter = feedIdFilter;
    }

    public Date getCreatedAtFilter() {
        return createdAtFilter;
    }

    public void setCreatedAtFilter(Date createdAtFilter) {
        this.createdAtFilter = createdAtFilter;
    }

}
