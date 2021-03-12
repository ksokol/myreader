package myreader.resource;

public final class ResourceConstants {

  private ResourceConstants() {
    // prevent instantiation
  }

  private static final String ID_VARIABLE = "{id}";

  private static final String API = "/api/2";

  public static final String SUBSCRIPTIONS = API + "/subscriptions";

  public static final String SUBSCRIPTION_ENTRIES = API + "/subscriptionEntries";
  public static final String SUBSCRIPTION_ENTRIES_AVAILABLE_TAGS = SUBSCRIPTION_ENTRIES + "/availableTags";
  public static final String SUBSCRIPTION_ENTRY = SUBSCRIPTION_ENTRIES + "/" + ID_VARIABLE;
}
