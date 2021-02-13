package myreader.config;

import myreader.resource.subscriptionentry.converter.SearchRequestHandlerMethodArgumentResolver;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

import static org.springframework.http.MediaType.APPLICATION_JSON;

@Configuration
@EnableTransactionManagement
public class MvcConfig implements WebMvcConfigurer {

  @Override
  public void configureContentNegotiation(final ContentNegotiationConfigurer configurer) {
    configurer
      .defaultContentType(APPLICATION_JSON)
      .favorParameter(false);
  }

  @Override
  public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
    argumentResolvers.add(new SearchRequestHandlerMethodArgumentResolver());
  }
}
