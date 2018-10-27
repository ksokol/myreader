package myreader.entity;

import org.hibernate.search.annotations.Analyze;
import org.hibernate.search.annotations.ContainedIn;
import org.hibernate.search.annotations.Field;

import javax.persistence.Access;
import javax.persistence.AccessType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.Date;
import java.util.Objects;
import java.util.Set;

/**
 * @author Kamill Sokol
 */
@Access(AccessType.PROPERTY)
@Entity
@Table(name = "user_feed_tag")
public class SubscriptionTag {

    private Long id;
    private String name;
    private String color;
    private User user;
    private Set<Subscription> subscriptions;
    private Date createdAt;

    /**
     * Default constructor for Hibernate.
     */
    public SubscriptionTag() {}

    public SubscriptionTag(String name, User user) {
        this.name = Objects.requireNonNull(name, "name is null");
        this.user = Objects.requireNonNull(user, "user is null");
    }

    @Id
    @GeneratedValue
    @Column(name = "user_feed_tag_id")
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Field(name = "tag", analyze = Analyze.NO)
    @Column(name = "user_feed_tag_name", nullable = false)
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Column(name = "user_feed_tag_color")
    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    @JoinColumn(name = "user_feed_tag_user_id")
    @ManyToOne(optional = false)
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @ContainedIn
    @OneToMany(mappedBy = "subscriptionTag")
    public Set<Subscription> getSubscriptions() {
        return subscriptions;
    }

    public void setSubscriptions(Set<Subscription> subscriptions) {
        this.subscriptions = subscriptions;
    }

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "user_feed_tag_created_at")
    public Date getCreatedAt() {
        if (createdAt != null) {
            return new Date(createdAt.getTime());
        }
        return new Date();
    }

    public void setCreatedAt(Date createdAt) {
        if (createdAt != null) {
            this.createdAt = new Date(createdAt.getTime());
        }
    }
}