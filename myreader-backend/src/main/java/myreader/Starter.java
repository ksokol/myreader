package myreader;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.TimeZone;

/**
 * @author Kamill Sokol
 */
@SpringBootApplication
public class Starter {

    public static void main(String[] args) throws Exception {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC")); // required by hsqldb
        System.setProperty("file.encoding","UTF-8");
        SpringApplication.run(Starter.class, args);
    }

}
