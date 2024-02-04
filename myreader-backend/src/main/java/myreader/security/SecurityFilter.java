package myreader.security;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;
import java.util.Objects;

public class SecurityFilter implements Filter {

  private static final List<String> PUBLIC_URLS = List.of("/index.html", "/static/", "/app/", "/favicon.ico");

  private final String userPassword;

  public SecurityFilter(String userPassword) {
    this.userPassword = "Bearer " + Objects.requireNonNull(userPassword, "userPassword is null");
  }

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
    var req = (HttpServletRequest) request;
    var res = (HttpServletResponse) response;
    var requestUrl = req.getRequestURI().substring(req.getContextPath().length());

    var isRootUrl = "/".equals(requestUrl);
    var isPublicUrl = PUBLIC_URLS.stream().anyMatch(requestUrl::startsWith);
    var isAuthenticated = userPassword.equals(req.getHeader("Authorization"));

    if (isRootUrl || isPublicUrl || isAuthenticated) {
      chain.doFilter(request, response);
    } else {
      res.setStatus(401);
    }
  }
}
