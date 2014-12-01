package spring.hateoas;

import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;

import org.junit.Test;
import org.springframework.hateoas.Resource;

/**
 * @author Kamill Sokol
 */
public class PagedResourcesAssemblerTest {

     @Test
     public void testNoGenerics() {
         PagedResourcesAssembler.SimpleResourceAssembler uut = new PagedResourcesAssembler.SimpleResourceAssembler();
         Resource resource = uut.toResource(new Object());
         assertThat(resource, not(nullValue()));
     }

}
