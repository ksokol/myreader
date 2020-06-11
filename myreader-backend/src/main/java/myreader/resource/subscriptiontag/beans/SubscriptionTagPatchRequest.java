package myreader.resource.subscriptiontag.beans;

import org.springframework.hateoas.RepresentationModel;

/**
 * @author Kamill Sokol
 */
public class SubscriptionTagPatchRequest extends RepresentationModel<SubscriptionTagPatchRequest> {

    private String name;
    private String color;

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

    @Override
    public boolean equals(Object o) {
        return super.equals(o);
    }

    @Override
    public int hashCode() {
        return super.hashCode();
    }
}
