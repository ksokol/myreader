package spring.data.web;

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
 * @author Oliver Gierke
 * @author Kamill Sokol
 */
public class SequenceableHandlerMethodArgumentResolver implements HandlerMethodArgumentResolver, UriComponentsContributor {

    private static final String DEFAULT_NEXT_PARAMETER = "next";
    private static final String DEFAULT_SIZE_PARAMETER = "size";
    private static final int DEFAULT_MAX_PAGE_SIZE = 50;
    private static final Sequenceable DEFAULT_PAGE_REQUEST = new SequenceRequest(20, Long.MAX_VALUE);
    private static final Long DEFAULT_NEXT = Long.MAX_VALUE;

    @Override
    public boolean supportsParameter(final MethodParameter parameter) {
        return Sequenceable.class.equals(parameter.getParameterType());
    }

    @Override
    public Object resolveArgument(final MethodParameter methodParameter, final ModelAndViewContainer mavContainer, final NativeWebRequest webRequest, final WebDataBinderFactory binderFactory) throws Exception {
        String nextString = webRequest.getParameter(getParameterNameToUse(DEFAULT_NEXT_PARAMETER));
        String pageSizeString = webRequest.getParameter(getParameterNameToUse(DEFAULT_SIZE_PARAMETER));

        boolean pageGiven = StringUtils.hasText(pageSizeString);

        if (!pageGiven) {
            return DEFAULT_PAGE_REQUEST;
        }

        Long next = StringUtils.hasText(nextString) ? parseAndApplyBoundaries(nextString, 0, DEFAULT_NEXT) : DEFAULT_NEXT;
        int pageSize = StringUtils.hasText(pageSizeString) ? parseAndApplyBoundaries(pageSizeString, 0, DEFAULT_MAX_PAGE_SIZE) : DEFAULT_PAGE_REQUEST.getPageSize();

        // Limit lower bound
        pageSize = pageSize < 1 ? DEFAULT_PAGE_REQUEST.getPageSize() : pageSize;
        // Limit upper bound
        pageSize = pageSize > DEFAULT_MAX_PAGE_SIZE ? DEFAULT_MAX_PAGE_SIZE : pageSize;

        return new SequenceRequest(pageSize, next);
    }

    protected String getParameterNameToUse(String source) {
        StringBuilder builder = new StringBuilder();
        return builder.append(source).toString();
    }

    private static int parseAndApplyBoundaries(String parameter, int lower, int upper) {
        try {
            int parsed = Integer.parseInt(parameter);
            return parsed < lower ? lower : parsed > upper ? upper : parsed;
        } catch (NumberFormatException e) {
            return lower;
        }
    }

    private static Long parseAndApplyBoundaries(String parameter, long lower, long upper) {
        try {
            Long parsed = Long.parseLong(parameter);
            return parsed < lower ? lower : parsed > upper ? upper : parsed;
        } catch (NumberFormatException e) {
            return DEFAULT_NEXT;
        }
    }

    @Override
    public void enhance(final UriComponentsBuilder builder, final MethodParameter parameter, final Object value) {
        if (!(value instanceof Sequence)) {
            return;
        }

        Sequence sequence = (Sequence) value;

        String nextPropertyName = getParameterNameToUse(DEFAULT_NEXT_PARAMETER);
        String sizePropertyName = getParameterNameToUse(DEFAULT_SIZE_PARAMETER);

        Long next = sequence.getNext();

        if(next != null) {
            builder.replaceQueryParam(nextPropertyName, sequence.getNext());
        }

        builder.replaceQueryParam(sizePropertyName, sequence.getPageSize() <= DEFAULT_NEXT ? sequence.getPageSize() : DEFAULT_NEXT);
    }
}
