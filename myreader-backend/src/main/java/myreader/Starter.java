package myreader;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

import java.util.TimeZone;

/**
 * @author Kamill Sokol
 */
@SpringBootApplication
public class Starter {

    static ApplicationContext applicationContext;

    public static void main(String[] args) throws Exception {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC")); // required by hsqldb
        System.setProperty("file.encoding", "UTF-8");
        applicationContext = SpringApplication.run(Starter.class, args);
    }

}
