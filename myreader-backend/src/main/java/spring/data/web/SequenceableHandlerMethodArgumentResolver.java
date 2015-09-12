package spring.data.web;

import static java.lang.Long.MAX_VALUE;
import static java.lang.Long.parseLong;

import org.springframework.core.MethodParameter;
import org.springframework.hateoas.mvc.UriComponentsContributor;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;
import org.springframework.web.util.UriComponentsBuilder;
import spring.data.domain.Sequence;
import spring.data.domain.SequenceRequest;
import spring.data.domain.Sequenceable;

/**
 * @author Kamill Sokol
 */
public class SequenceableHandlerMethodArgumentResolver implements HandlerMethodArgumentResolver, UriComponentsContributor {

    private static final String DEFAULT_NEXT_PARAMETER = "next";
    private static final String DEFAULT_SIZE_PARAMETER = "size";
    private static final int DEFAULT_MAX_PAGE_SIZE = 50;
    private static final int DEFAULT_PAGE_SIZE = 20;
    private static final Sequenceable DEFAULT_PAGE_REQUEST = new SequenceRequest(DEFAULT_PAGE_SIZE, MAX_VALUE);
    private static final long DEFAULT_NEXT = MAX_VALUE;

    @Override
    public boolean supportsParameter(final MethodParameter parameter) {
        return Sequenceable.class.equals(parameter.getParameterType());
    }

    @Override
    public Object resolveArgument(final MethodParameter methodParameter, final ModelAndViewContainer mavContainer, final NativeWebRequest webRequest, final WebDataBinderFactory binderFactory) throws Exception {
        String nextString = webRequest.getParameter(DEFAULT_NEXT_PARAMETER);
        String pageSizeString = webRequest.getParameter(DEFAULT_SIZE_PARAMETER);
        boolean pageGiven = StringUtils.hasText(pageSizeString);

        if (!pageGiven) {
            return DEFAULT_PAGE_REQUEST;
        }

        long next = StringUtils.hasText(nextString) ? parseAndApplyBoundaries(nextString, 0) : DEFAULT_NEXT;
        int pageSize = parseAndApplyBoundaries(pageSizeString, 0, DEFAULT_MAX_PAGE_SIZE);

        return new SequenceRequest(pageSize, next);
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

    private static int parseAndApplyBoundaries(String parameter, int lower, int upper) {
        try {
            int parsed = Integer.parseInt(parameter);
            return parsed < lower ? DEFAULT_PAGE_SIZE : parsed > upper ? upper : parsed;
        } catch (NumberFormatException e) {
            return DEFAULT_PAGE_SIZE;
        }
    }

    private static long parseAndApplyBoundaries(String parameter, long lower) {
        try {
            long parsed = parseLong(parameter);
            return parsed < lower ? lower : parsed;
        } catch (NumberFormatException e) {
            return DEFAULT_NEXT;
        }
    }
}
