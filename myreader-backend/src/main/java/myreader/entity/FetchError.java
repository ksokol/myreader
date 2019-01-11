package myreader.entity;

import javax.persistence.Access;
import javax.persistence.AccessType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.Date;

/**
 * @author Kamill Sokol
 */
@Access(AccessType.PROPERTY)
@Entity
@Table(name = "fetch_error")
public class FetchError {

    private Long id;
    private Feed feed;
    private String message;
    private Date createdAt;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fetch_error_id")
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "fetch_error_feed_id", nullable = false, updatable = false)
    public Feed getFeed() {
        return feed;
    }

    public void setFeed(Feed feed) {
        this.feed = feed;
    }

    @Column(columnDefinition = "VARCHAR(1000)", name = "fetch_error_message")
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "fetch_error_created_at", nullable = false)
    public Date getCreatedAt() {
        if(createdAt != null) {
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
