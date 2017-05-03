package myreader.resource.processing;

import myreader.resource.processing.beans.ProcessingPutRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.AsyncResult;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.concurrent.Future;

/**
 * @author Kamill Sokol
 */
@PreAuthorize("hasRole('ROLE_ADMIN')")
@RestController
@RequestMapping(value = "api/2/processing")
public class ProcessingCollectionResource {

    private final ApplicationContext applicationContext;

    @Autowired
    public ProcessingCollectionResource(final ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    //TODO
    @Async
    @RequestMapping(value = "", method = RequestMethod.PUT)
    public Future<Void> runProcess(@Valid @RequestBody ProcessingPutRequest request) {
        final Runnable runnable = applicationContext.getBean(request.getProcess(), Runnable.class);
        runnable.run();
        return new AsyncResult<>(null);
    }
}
