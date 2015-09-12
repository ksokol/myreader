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

    @Override
    public int hashCode() {
        return uuid.hashCode();
    }

    @Override
    public boolean equals(final Object object) {
        if (this == object) {
            return true;
        }

        if (object == null || !object.getClass().equals(this.getClass())) {
            return false;
        }

        UUIDResourceSupport that = (UUIDResourceSupport) object;

        return this.uuid.equals(that.uuid);
    }
}
