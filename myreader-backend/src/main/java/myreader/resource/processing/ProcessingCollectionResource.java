package myreader.resource.processing;

import myreader.resource.processing.beans.ProcessingPutRequest;
import myreader.resource.processing.beans.ProcessingPutRequestValidator;
import org.springframework.context.ApplicationContext;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.AsyncResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.transaction.Transactional;
import java.util.concurrent.Future;

import static myreader.resource.ResourceConstants.PROCESSING;

@RestController
public class ProcessingCollectionResource {

  private final ApplicationContext applicationContext;

  public ProcessingCollectionResource(final ApplicationContext applicationContext) {
    this.applicationContext = applicationContext;
  }

  @InitBinder
  public void binder(WebDataBinder binder) {
    binder.addValidators(new ProcessingPutRequestValidator(applicationContext));
  }

  @Transactional
  @Async("applicationTaskExecutor")
  @PutMapping(PROCESSING)
  public Future<Void> runProcess(@Validated @RequestBody ProcessingPutRequest request) {
    final Runnable runnable = applicationContext.getBean(request.getProcess(), Runnable.class);
    runnable.run();
    return new AsyncResult<>(null);
  }
}
