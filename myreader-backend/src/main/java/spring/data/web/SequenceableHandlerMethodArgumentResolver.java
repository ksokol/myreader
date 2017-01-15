package spring.data.web;

import org.springframework.core.MethodParameter;
import org.springframework.hateoas.mvc.UriComponentsContributor;
import org.springframework.web.util.UriComponentsBuilder;
import spring.data.domain.Sequence;

/**
 * @author Kamill Sokol
 */
public class SequenceableHandlerMethodArgumentResolver implements UriComponentsContributor {

    private static final String DEFAULT_NEXT_PARAMETER = "next";
    private static final String DEFAULT_SIZE_PARAMETER = "size";

    public boolean supportsParameter(final MethodParameter parameter) {
        return Sequence.class.equals(parameter.getParameterType());
    }

    @Override
    public void enhance(final UriComponentsBuilder builder, final MethodParameter parameter, final Object value) {
        if (!(value instanceof Sequence)) {
            return;
        }

        Sequence sequence = (Sequence) value;
        Long next = sequence.getNext();

        if(next != null) {
            builder.replaceQueryParam(DEFAULT_NEXT_PARAMETER, sequence.getNext());
        }

        builder.replaceQueryParam(DEFAULT_SIZE_PARAMETER, sequence.getPageSize());
    }
}
