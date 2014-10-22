package myreader.resource.service.patch;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.nullValue;
import static org.hamcrest.Matchers.containsString;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.io.ByteArrayInputStream;

import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageNotReadableException;

/**
 * @author Kamill Sokol
 */
public class PatchSupportMessageConverterTest {

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    private PatchSupportMessageConverter uut = new PatchSupportMessageConverter();

    @Test
    public void testEmptyBody() throws Exception {
        HttpInputMessage mock = mock(HttpInputMessage.class);

        when(mock.getBody()).thenReturn(new ByteArrayInputStream("{}".getBytes()));
        PatchSupportTestBean patchable = (PatchSupportTestBean) uut.read(PatchSupportTestBean.class, null, mock);

        assertThat(patchable.getaString1(), nullValue());
        assertThat(patchable.getaString2(), nullValue());
        assertThat(patchable.isaBooleanPrimitive(), is(false));
        assertThat(patchable.getaBoolean(), nullValue());
        assertThat(patchable.getaLongPrimitive(), is(0L));
        assertThat(patchable.getaLong(), nullValue());
    }

    @Test
    public void testNullValuesForPrimitives() throws Exception {
        ClassPathResource classPathResource = new ClassPathResource("/json/patch/testNullValuesForPrimitives.json");

        HttpInputMessage mock = mock(HttpInputMessage.class);
        thrown.expect(HttpMessageNotReadableException.class);
        thrown.expectMessage(containsString("Failed to convert property value of type 'null' to required type 'boolean' for property 'aBooleanPrimitive'"));
        when(mock.getBody()).thenReturn(classPathResource.getInputStream());

        uut.read(PatchSupportTestBean.class, null, mock);
    }

    @Test
    public void testUnknownProperties() throws Exception {
        HttpInputMessage mock = mock(HttpInputMessage.class);

        when(mock.getBody()).thenReturn(new ByteArrayInputStream("{\"unknownProperty\":\"value\"}".getBytes()));

        PatchSupportTestBean patchable = (PatchSupportTestBean) uut.read(PatchSupportTestBean.class, null, mock);

        assertThat(patchable.getaString1(), nullValue());
        assertThat(patchable.getaString2(), nullValue());
        assertThat(patchable.isaBooleanPrimitive(), is(false));
        assertThat(patchable.getaBoolean(), nullValue());
        assertThat(patchable.getaLongPrimitive(), is(0L));
        assertThat(patchable.getaLong(), nullValue());
    }

    @Test
    public void testDeserialization() throws Exception {
        ClassPathResource classPathResource = new ClassPathResource("/json/patch/testDeserialization.json");

        HttpInputMessage mock = mock(HttpInputMessage.class);
        when(mock.getBody()).thenReturn(classPathResource.getInputStream());

        PatchSupportTestBean patchable = (PatchSupportTestBean) uut.read(PatchSupportTestBean.class, null, mock);

        assertThat(patchable.getaString1(), is("aString1"));
        assertThat(patchable.getaString2(), is("aString2"));
        assertThat(patchable.isaBooleanPrimitive(), is(true));
        assertThat(patchable.getaBoolean(), is(Boolean.TRUE));
        assertThat(patchable.getaLongPrimitive(), is(1L));
        assertThat(patchable.getaLong(), is(1L));
    }

    @Test(expected = UnsupportedOperationException.class)
    public void testExceptionInWriteMethod() throws Exception {
        HttpOutputMessage mock = mock(HttpOutputMessage.class);
        when(mock.getHeaders()).thenReturn(new HttpHeaders());

        uut.write(null, null, mock);
    }

    @Test
    public void testSupportedMimeTypes() throws Exception {
        assertThat(uut.canRead(Object.class, MediaType.APPLICATION_JSON), is(false));
        assertThat(uut.canRead(PatchSupport.class, MediaType.APPLICATION_JSON), is(true));
        assertThat(uut.canRead(PatchSupportTestBean.class, MediaType.APPLICATION_JSON), is(true));
        assertThat(uut.canRead(PatchSupportTestBean.class, MediaType.ALL), is(false));
    }

    @Test(expected = UnsupportedOperationException.class)
    public void testCanWrite() {
        uut.canWrite(MediaType.ALL);
    }

    static class PatchSupportTestBean extends PatchSupport {
        private String aString1;
        private String aString2;
        private boolean aBooleanPrimitive;
        private Boolean aBoolean;
        private long aLongPrimitive;
        private Long aLong;

        public String getaString1() {
            return aString1;
        }

        public void setaString1(String aString1) {
            this.aString1 = aString1;
        }

        public String getaString2() {
            return aString2;
        }

        public void setaString2(String aString2) {
            this.aString2 = aString2;
        }

        public boolean isaBooleanPrimitive() {
            return aBooleanPrimitive;
        }

        public void setaBooleanPrimitive(boolean aBooleanPrimitive) {
            this.aBooleanPrimitive = aBooleanPrimitive;
        }

        public Boolean getaBoolean() {
            return aBoolean;
        }

        public void setaBoolean(Boolean aBoolean) {
            this.aBoolean = aBoolean;
        }

        public long getaLongPrimitive() {
            return aLongPrimitive;
        }

        public void setaLongPrimitive(long aLongPrimitive) {
            this.aLongPrimitive = aLongPrimitive;
        }

        public Long getaLong() {
            return aLong;
        }

        public void setaLong(Long aLong) {
            this.aLong = aLong;
        }
    }
}
