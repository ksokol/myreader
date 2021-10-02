package myreader.views.navigation;

import myreader.entity.SubscriptionView;

import java.util.HashMap;
import java.util.Map;

public class NavigationConverter {

  private NavigationConverter() {
    // prevent instantiation
  }

  public static Map<String, Object> convert(SubscriptionView source) {
    var target = new HashMap<String, Object>();

    target.put("uuid", source.getId().toString());
    target.put("origin", source.getUrl());
    target.put("title", source.getTitle());
    target.put("sum", source.getAcceptedFetchCount());
    target.put("tag", source.getTag());
    target.put("color", source.getColor());
    target.put("unseen", source.getUnseen());
    target.put("fetchErrorCount", source.getFetchErrorCount());
    target.put("createdAt", source.getCreatedAt());

    return target;
  }
}
