package myreader.resource.subscriptiontag.beans;

import org.springframework.hateoas.ResourceSupport;

import java.util.Date;

/**
 * @author Kamill Sokol
 */
public class SubscriptionTagGetResponse extends ResourceSupport {

    private String uuid;
    private String name;
    private String color;
    private Date createdAt;

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

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

    @Override
    public boolean equals(Object o) {
        return super.equals(o);
    }

    @Override
    public int hashCode() {
        return super.hashCode();
    }
}
