package myreader;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * @author Kamill Sokol
 */
@SpringBootApplication
public class Starter {

    public static void main(String[] args) {
        String[] ignoringArgs = {};
        SpringApplication.run(Starter.class, ignoringArgs);
    }
}
