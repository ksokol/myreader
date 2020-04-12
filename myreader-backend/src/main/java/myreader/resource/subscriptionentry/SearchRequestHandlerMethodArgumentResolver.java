package myreader.resource.subscriptionentry;

import myreader.resource.subscriptionentry.beans.SearchRequest;
import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.time.Clock;
import java.util.Objects;

/**
 * @author Kamill Sokol
 */
public class SearchRequestHandlerMethodArgumentResolver implements HandlerMethodArgumentResolver {

    private final Clock clock;

    public SearchRequestHandlerMethodArgumentResolver(Clock clock) {
        this.clock = Objects.requireNonNull(clock, "clock is null");
    }


    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return SearchRequest.class.isAssignableFrom(parameter.getParameterType());
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest, WebDataBinderFactory binderFactory) {
        SearchRequest searchRequest = new SearchRequest(clock);

        searchRequest.setEntryTagEqual(webRequest.getParameter("entryTagEqual"));
        searchRequest.setFeedTagEqual(webRequest.getParameter("feedTagEqual"));
        searchRequest.setFeedUuidEqual(webRequest.getParameter("feedUuidEqual"));
        searchRequest.setQ(webRequest.getParameter("q"));
        searchRequest.setSeenEqual(webRequest.getParameter("seenEqual"));

        String stampParam = webRequest.getParameter("stamp");
        if (stampParam != null && stampParam.matches("\\d+")) {
            searchRequest.setStamp(Long.parseLong(stampParam));
        }

        return searchRequest;
    }
}
