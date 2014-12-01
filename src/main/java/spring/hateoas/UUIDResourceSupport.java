package spring.hateoas;

import org.springframework.hateoas.ResourceSupport;

/**
 * @author Kamill Sokol
 */
public class UUIDResourceSupport extends ResourceSupport {

    private String uuid;

    public String getUuid() {
        return uuid;
    }

    public void setUuid(final String uuid) {
        this.uuid = uuid;
    }
}
