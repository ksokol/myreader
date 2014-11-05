package spring.hateoas;

import java.util.Arrays;
import java.util.Collection;

import javax.xml.bind.annotation.XmlRootElement;

import org.springframework.hateoas.Link;
import org.springframework.hateoas.Resources;

/**
 * @author Oliver Gierke
 * @author Kamill Sokol
 */
@XmlRootElement(name = "slicedEntities")
public class SequencedResources<T> extends Resources<T> {

    public SequencedResources(Collection<T> content, Link... links) {
        this(content, Arrays.asList(links));
    }

    public SequencedResources(Collection<T> content, Iterable<Link> links) {
        super(content, links);
    }

}
