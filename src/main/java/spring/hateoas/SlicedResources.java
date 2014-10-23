package spring.hateoas;

import java.util.Arrays;
import java.util.Collection;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;

import org.springframework.hateoas.Link;
import org.springframework.hateoas.Resources;
import org.springframework.util.Assert;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * @author Oliver Gierke
 * @author Kamill Sokol
 */
@XmlRootElement(name = "slicedEntities")
public class SlicedResources<T> extends Resources<T> {

    @JsonProperty("page")
    private PageMetadata metadata;

    public SlicedResources(Collection<T> content, PageMetadata metadata, Link... links) {
        this(content, metadata, Arrays.asList(links));
    }

    public SlicedResources(Collection<T> content, PageMetadata metadata, Iterable<Link> links) {
        super(content, links);
        this.metadata = metadata;
    }

    public PageMetadata getMetadata() {
        return metadata;
    }

    /**
     *
     * @author Oliver Gierke
     * @author Kamill Sokol
     */
    public static class PageMetadata {
        @XmlAttribute
        @JsonProperty
        private long size;
        @XmlAttribute
        @JsonProperty
        private long number;

        public PageMetadata(long size, long number) {
            Assert.isTrue(size > -1, "Size must not be negative!");
            Assert.isTrue(number > -1, "Number must not be negative!");

            this.size = size;
            this.number = number;
        }

        public long getSize() {
            return size;
        }

        public long getNumber() {
            return number;
        }

    }
}
