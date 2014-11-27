package spring.data.web;

import org.junit.Before;
import org.junit.Test;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.util.UriComponentsBuilder;
import spring.data.domain.SequenceImpl;
import spring.data.domain.SequenceRequest;

import static java.lang.Long.MAX_VALUE;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class SequenceableHandlerMethodArgumentResolverTest {

    private SequenceableHandlerMethodArgumentResolver uut = new SequenceableHandlerMethodArgumentResolver();
    private NativeWebRequest webRequestMock = mock(NativeWebRequest.class);

    @Before
    public void before() {
        reset(webRequestMock);
    }

    @Test
    public void testResolveArgumentInvalidParameterTypes() throws Exception {
        when(webRequestMock.getParameter("next")).thenReturn("string");
        when(webRequestMock.getParameter("size")).thenReturn("string");

        SequenceRequest result = (SequenceRequest) uut.resolveArgument(null, null, webRequestMock, null);

        assertThat(result.getPageSize(), is(20));
        assertThat(result.getNext(), is(MAX_VALUE));
    }

    @Test
    public void testResolveArgumentNegativeParameterValues() throws Exception {
        when(webRequestMock.getParameter("next")).thenReturn("-1");
        when(webRequestMock.getParameter("size")).thenReturn("-1");

        SequenceRequest result = (SequenceRequest) uut.resolveArgument(null, null, webRequestMock, null);

        assertThat(result.getPageSize(), is(20));
        assertThat(result.getNext(), is(0L));
    }

    @Test
    public void testResolveArgumentParameterValuesOutOfBound() throws Exception {
        when(webRequestMock.getParameter("next")).thenReturn("9223372036854775808"); //Long.MAX_VALUE + 1
        when(webRequestMock.getParameter("size")).thenReturn("51");

        SequenceRequest result = (SequenceRequest) uut.resolveArgument(null, null, webRequestMock, null);

        assertThat(result.getPageSize(), is(50));
        assertThat(result.getNext(), is(MAX_VALUE));
    }

    @Test
    public void testResolveArgumentParameterNotGiven() throws Exception {
        SequenceRequest result = (SequenceRequest) uut.resolveArgument(null, null, webRequestMock, null);

        assertThat(result.getPageSize(), is(20));
        assertThat(result.getNext(), is(MAX_VALUE));
    }

    @Test
    public void testEnhanceWrongValueType() throws Exception {
        UriComponentsBuilder uriComponentsBuilderMock = mock(UriComponentsBuilder.class);

        uut.enhance(uriComponentsBuilderMock, null, new Object());
        verify(uriComponentsBuilderMock, never()).buildAndExpand(any(), any());
    }

    @Test
    public void testEnhanceHasNoNext() throws Exception {
        UriComponentsBuilder uriComponentsBuilder = UriComponentsBuilder.newInstance();

        uut.enhance(uriComponentsBuilder, null, new SequenceImpl());
        assertThat(uriComponentsBuilder.build().getQuery(), is("size=0"));
    }
}