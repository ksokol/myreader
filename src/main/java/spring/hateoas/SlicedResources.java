package spring.hateoas;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;

import org.springframework.hateoas.Link;
import org.springframework.hateoas.Resources;
import org.springframework.util.Assert;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 *@author Oliver Gierke
 * @author Kamill Sokol
 */
@XmlRootElement(name = "slicedEntities")
public class SlicedResources<T> extends Resources<T> {

    @JsonProperty("page")
    private PageMetadata metadata;

    protected SlicedResources() {
        this(new ArrayList<T>(), null);
    }

    public SlicedResources(Collection<T> content, PageMetadata metadata, Link... links) {
        this(content, metadata, Arrays.asList(links));
    }

    public SlicedResources(Collection<T> content, PageMetadata metadata, Iterable<Link> links) {
        super(content, links);
        this.metadata = metadata;
    }

    @Override
    public String toString() {
        return String.format("SlicedResources { content: %s, metadata: %s, links: %s }", getContent(), metadata, getLinks());
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }

        if (obj == null || !getClass().equals(obj.getClass())) {
            return false;
        }

        SlicedResources<?> that = (SlicedResources<?>) obj;
        boolean metadataEquals = this.metadata == null ? that.metadata == null : this.metadata.equals(that.metadata);

        return metadataEquals ? super.equals(obj) : false;
    }

    @Override
    public int hashCode() {
        int result = super.hashCode();
        result += this.metadata == null ? 0 : 31 * this.metadata.hashCode();
        return result;
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

        @Override
        public String toString() {
            return String.format("Metadata { number: %d, size: %d }", number, size);
        }

        @Override
        public boolean equals(Object obj) {
            if (this == obj) {
                return true;
            }

            if (obj == null || !obj.getClass().equals(getClass())) {
                return false;
            }

            PageMetadata that = (PageMetadata) obj;

            return this.number == that.number && this.size == that.size;
        }

        @Override
        public int hashCode() {
            int result = 17;
            result += 31 * (int) (this.number ^ this.number >>> 32);
            result += 31 * (int) (this.size ^ this.size >>> 32);
            return result;
        }
    }
}
