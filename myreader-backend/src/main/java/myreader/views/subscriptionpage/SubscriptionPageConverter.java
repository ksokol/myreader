package myreader.views.subscriptionpage;

import myreader.entity.ExclusionPattern;
import myreader.entity.Subscription;

import java.util.HashMap;
import java.util.Map;

class SubscriptionPageConverter {

  private SubscriptionPageConverter() {
    // prevent instantiation
  }

  static Map<String, Object> convertSubscription(Subscription source) {
    var target = new HashMap<String, Object>();
    
    target.put("uuid", source.getId().toString());
    target.put("title", source.getTitle());
    target.put("origin", source.getUrl());
    target.put("tag", source.getTag());
    target.put("color", source.getColor());
    target.put("stripImages", source.isStripImages());
    target.put("lastErrorMessage", source.getLastErrorMessage());
    target.put("lastErrorMessageDatetime", source.getLastErrorMessageDatetime());

    return target;
  }

  static Map<String, Object> convertExclusionPattern(ExclusionPattern source) {
    return Map.of(
      "uuid", source.getId().toString(),
      "pattern", source.getPattern(),
      "hitCount", source.getHitCount()
    );
  }
}
