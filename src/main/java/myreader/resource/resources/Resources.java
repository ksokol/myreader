package myreader.resource.resources;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Kamill Sokol
 */
@RestController
public class Resources {

    @RequestMapping({"/api/2/", "/api/2"})
    public void get() {
        // do nothing
    }
}
