package myreader.entity;

import org.apache.lucene.analysis.pattern.PatternTokenizerFactory;
import org.hibernate.search.annotations.Analyzer;
import org.hibernate.search.annotations.AnalyzerDef;
import org.hibernate.search.annotations.Boost;
import org.hibernate.search.annotations.DocumentId;
import org.hibernate.search.annotations.Field;
import org.hibernate.search.annotations.Indexed;
import org.hibernate.search.annotations.IndexedEmbedded;
import org.hibernate.search.annotations.NumericField;
import org.hibernate.search.annotations.Parameter;
import org.hibernate.search.annotations.TokenizerDef;

import javax.persistence.Access;
import javax.persistence.AccessType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.Date;

@Access(AccessType.PROPERTY)
@AnalyzerDef(name = "tag" , tokenizer = @TokenizerDef(factory = PatternTokenizerFactory.class, params = @Parameter(name = "pattern" , value = "\\ |,")))
@Indexed
@Entity
@Table(name = "user_feed_entry")
public class SubscriptionEntry {

    private Long id;
    private boolean seen;
    private String tag;
    private Subscription subscription;
    private FeedEntry feedEntry;
    private Date createdAt;

    @Deprecated
    public SubscriptionEntry() {}

    public SubscriptionEntry(Subscription subscription, FeedEntry feedEntry) {
        this.subscription = subscription;
        this.feedEntry = feedEntry;
    }

    @DocumentId
    @NumericField(precisionStep = 0)
    @Id
    @GeneratedValue
    @Column(name = "user_feed_entry_id")
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Field
    @Column(name = "user_feed_entry_is_read")
    public boolean isSeen() {
        return seen;
    }

    public void setSeen(boolean seen) {
        this.seen = seen;
    }

    @Analyzer(definition = "tag")
    @Field(boost = @Boost(value = 0.5F))
    @Column(columnDefinition = "VARCHAR(1000)", name = "user_feed_entry_tag")
    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    @IndexedEmbedded
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_feed_entry_user_feed_id")
    public Subscription getSubscription() {
        return subscription;
    }

    public void setSubscription(Subscription subscription) {
        this.subscription = subscription;
    }

    @IndexedEmbedded
    @ManyToOne(optional = false,fetch = FetchType.LAZY)
    @JoinColumn(name = "user_feed_entry_entry_id")
    public FeedEntry getFeedEntry() {
        return feedEntry;
    }

    public void setFeedEntry(FeedEntry feedEntry) {
        this.feedEntry = feedEntry;
    }

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "user_feed_entry_created_at")
    public Date getCreatedAt() {
        if(createdAt != null){
            return new Date(createdAt.getTime());
        }
        return new Date();
    }

    public void setCreatedAt(Date createdAt) {
        if(createdAt != null) {
            this.createdAt = new Date(createdAt.getTime());
        }
    }
}
