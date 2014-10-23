package spring.hateoas;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import myreader.resource.subscriptiontaggroup.SubscriptionTagGroupCollectionResource;
import myreader.resource.subscriptiontaggroup.beans.SubscriptionTagGroupGetResponse;

import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;

/**
 * @author Kamill Sokol
 */
public class DelegatingEntityLinksTest {

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    @Test
    public void testGetDelegateForInternalReturnNotNull() throws Exception {
        List<EntityLinker> el = new ArrayList<>();
        el.add(new EntityLinker(SubscriptionTagGroupGetResponse.class, SubscriptionTagGroupCollectionResource.class));
        DelegatingEntityLinks uut = new DelegatingEntityLinks(el);
        EntityLinks delegateForInternal = uut.getDelegateForInternal(SubscriptionTagGroupGetResponse.class);
        assertThat(delegateForInternal, not(nullValue()));
    }

    @Test
    public void testSupportsReturnsTrue() throws Exception {
        List<EntityLinker> el = new ArrayList<>();
        el.add(new EntityLinker(SubscriptionTagGroupGetResponse.class, SubscriptionTagGroupCollectionResource.class));
        DelegatingEntityLinks uut = new DelegatingEntityLinks(el);
        boolean supports = uut.supports(SubscriptionTagGroupGetResponse.class);
        assertThat(supports, is(true));
    }

    @Test
    public void testSupportsReturnsFalse() throws Exception {
        DelegatingEntityLinks uut = new DelegatingEntityLinks(Collections.<EntityLinker>emptyList());
        boolean supports = uut.supports(Object.class);
        assertThat(supports, is(false));
    }

    @Test
    public void testGetDelegateForInternalReturnNull() throws Exception {
        DelegatingEntityLinks uut = new DelegatingEntityLinks(Collections.<EntityLinker>emptyList());
        EntityLinks delegateForInternal = uut.getDelegateForInternal(Object.class);
        assertThat(delegateForInternal, nullValue());
    }

    @Test
    public void testGetDelegateFor() {
        DelegatingEntityLinks uut = new DelegatingEntityLinks(Collections.<EntityLinker>emptyList());
        expectedException.expect(IllegalArgumentException.class);
        expectedException.expectMessage(is("Cannot determine link for java.lang.Object. No entityLinks instance found supporting the domain type!"));
        uut.getDelegateFor(Object.class);
    }
}
