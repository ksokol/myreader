package myreader.resource.subscriptiontag.beans;

import org.hibernate.validator.constraints.NotBlank;
import org.springframework.hateoas.ResourceSupport;

import javax.validation.constraints.Pattern;

/**
 * @author Kamill Sokol
 */
public class SubscriptionTagPatchRequest extends ResourceSupport {

    @NotBlank(message = "may not be empty")
    private String name;

    @Pattern(regexp="^#(?:[0-9a-fA-F]{3}){1,2}$", message = "not a RGB hex code")
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
