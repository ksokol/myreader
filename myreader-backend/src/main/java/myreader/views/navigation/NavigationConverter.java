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

    target.put("uuid", source.id().toString());
    target.put("origin", source.url());
    target.put("title", source.title());
    target.put("sum", source.acceptedFetchCount());
    target.put("tag", source.tag());
    target.put("color", source.color());
    target.put("unseen", source.unseen());
    target.put("lastErrorMessageDatetime", source.lastErrorMessageDatetime());
    target.put("createdAt", source.createdAt());

    return target;
  }
}
