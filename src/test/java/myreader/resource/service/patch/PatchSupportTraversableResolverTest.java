package myreader.resource.service.patch;

import org.junit.Test;

/**
 * @author Kamill Sokol
 */
public class PatchSupportTraversableResolverTest {

    @Test(expected = UnsupportedOperationException.class)
    public void testIsCascadable() throws Exception {
        new PatchSupportTraversableResolver().isCascadable(null, null, null, null, null);
    }
}
