package spring.hateoas;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

import org.junit.Test;

import spring.hateoas.annotation.Rel;

public class EntityLinkerTest {

    @Test
    public void testEntityClassWithRel() {
        EntityLinker entityLinker = new EntityLinker(Entity.class, Object.class);
        assertThat(entityLinker.getRel(), is("test"));
    }

    @Test
    public void testEntityClassWithoutRel() {
        EntityLinker entityLinker = new EntityLinker(Object.class, Object.class);
        assertThat(entityLinker.getRel(), is("object"));
    }

    @Rel("test")
    static class Entity {}

}
