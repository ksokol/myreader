package myreader.resource.subscriptionentry.converter;

import myreader.resource.subscriptionentry.beans.SearchRequest;
import org.springframework.core.MethodParameter;
import org.springframework.web.bind.ServletRequestBindingException;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

public class SearchRequestHandlerMethodArgumentResolver implements HandlerMethodArgumentResolver {

  private static final String TRUE = "true";
  private static final String FALSE = "false";

  @Override
  public boolean supportsParameter(MethodParameter parameter) {
    return SearchRequest.class.isAssignableFrom(parameter.getParameterType());
  }

  @Override
  public Object resolveArgument(
    MethodParameter parameter,
    ModelAndViewContainer mavContainer,
    NativeWebRequest webRequest,
    WebDataBinderFactory binderFactory
  ) throws ServletRequestBindingException {
    var searchRequest = new SearchRequest();

    searchRequest.setFeedTagEqual(webRequest.getParameter("feedTagEqual"));
    searchRequest.setFeedUuidEqual(webRequest.getParameter("feedUuidEqual"));

    var seenEqual = webRequest.getParameter("seenEqual");
    if (TRUE.equalsIgnoreCase(seenEqual) || FALSE.equalsIgnoreCase(seenEqual)) {
      searchRequest.setSeenEqual(Boolean.parseBoolean(seenEqual));
    } else if (seenEqual != null) {
      throw new ServletRequestBindingException("seenEqual is not of type boolean");
    }

    var uuidParam = webRequest.getParameter("uuid");
    if (uuidParam != null && uuidParam.matches("\\d+")) {
      searchRequest.setUuid(Long.parseLong(uuidParam));
    }

    return searchRequest;
  }
}
