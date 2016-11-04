package myreader.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ApiUnknownResourceController {

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @RequestMapping("api/**")
    public void notFound() { }
}
