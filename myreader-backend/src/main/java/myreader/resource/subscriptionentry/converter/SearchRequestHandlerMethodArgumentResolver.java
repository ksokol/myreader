package myreader.resource.subscriptionentry.converter;

import myreader.resource.subscriptionentry.beans.SearchRequest;
import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

public class SearchRequestHandlerMethodArgumentResolver implements HandlerMethodArgumentResolver {

  @Override
  public boolean supportsParameter(MethodParameter parameter) {
    return SearchRequest.class.isAssignableFrom(parameter.getParameterType());
  }

  @Override
  public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest, WebDataBinderFactory binderFactory) {
    var searchRequest = new SearchRequest();

    searchRequest.setEntryTagEqual(webRequest.getParameter("entryTagEqual"));
    searchRequest.setFeedTagEqual(webRequest.getParameter("feedTagEqual"));
    searchRequest.setFeedUuidEqual(webRequest.getParameter("feedUuidEqual"));
    searchRequest.setSeenEqual(webRequest.getParameter("seenEqual"));

    var nextParam = webRequest.getParameter("next");
    if (nextParam != null && nextParam.matches("\\d+")) {
      searchRequest.setNext(Long.parseLong(nextParam));
    }

    var sizeParam = webRequest.getParameter("size");
    if (sizeParam != null && sizeParam.matches("\\d+")) {
      searchRequest.setSize(Integer.parseInt(sizeParam));
    }

    return searchRequest;
  }
}
