package myreader.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

/**
 * @author Kamill Sokol
 */
@Entity
@Table(name = "exclusion_pattern")
public class ExclusionPattern implements Identifiable {

    @Id
    @GeneratedValue
    private Long id;

    private String pattern;

    @Column(name = "hit_count")
    private int hitCount;

    @ManyToOne(optional = false)
    @JoinColumn(name = "exclusion_pattern_user_feed_id")
    private Subscription subscription;

    public ExclusionPattern() {
        //TODO
        this.createdAt = new Date();
    }

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Override
    public Long getId() {
        return id;
    }

    @Override
    public void setId(Long id) {
        this.id = id;
    }

    public String getPattern() {
        return pattern;
    }

    public void setPattern(String pattern) {
        this.pattern = pattern;
    }

    public int getHitCount() {
        return hitCount;
    }

    public void setHitCount(int hitCount) {
        this.hitCount = hitCount;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Subscription getSubscription() {
        return subscription;
    }

    public void setSubscription(Subscription subscription) {
        this.subscription = subscription;
    }
}
