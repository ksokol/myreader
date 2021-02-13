package myreader.config;

public enum UrlMappings {

  LOGIN_PROCESSING("check"),
  API_2("api/2");

  private final String mapping;

  UrlMappings(final String mapping) {
    this.mapping = "/" + mapping;
  }

  public String mapping() {
    return mapping;
  }

}
