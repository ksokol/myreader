package myreader.resource.service.patch;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.core.IsNull.nullValue;
import static org.junit.Assert.assertThat;

import org.junit.Test;

/**
 * @author Kamill Sokol
 */
public class PatchServiceImplTest {

    private PatchServiceImpl uut = new PatchServiceImpl();

    @Test(expected = IllegalArgumentException.class)
    public void testAssertNullParam1() {
        uut.patch(null, new Object());
    }

    @Test(expected = IllegalArgumentException.class)
    public void testAssertNullParam2() {
        uut.patch(new PatchSupport(), null);
    }

    @Test
    public void testIfStringFieldIsPatched() {
        TestPatchSupport testPatchSupport = new TestPatchSupport();
        testPatchSupport.setField1("s1");

        TargetClass target = uut.patch(testPatchSupport, new TargetClass());

        assertThat(target.getField1(), is("s1"));
        assertThat(target.getField2(), nullValue());
    }

    static class TestPatchSupport extends PatchSupport {
        private String field1;
        private String field2;

        public String getField1() {
            return field1;
        }

        public void setField1(String field1) {
            addPatchedField("field1");
            this.field1 = field1;
        }

        public String getField2() {
            return field2;
        }

        public void setField2(String field2) {
            addPatchedField("field2");
            this.field2 = field2;
        }
    }

    static class TargetClass {
        private String field1;
        private String field2;

        public String getField1() {
            return field1;
        }

        public void setField1(String field1) {
            this.field1 = field1;
        }

        public String getField2() {
            return field2;
        }

        public void setField2(String field2) {
            this.field2 = field2;
        }
    }

}
