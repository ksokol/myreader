package myreader;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.util.Assert;

import java.nio.charset.Charset;
import java.util.TimeZone;

/**
 * @author Kamill Sokol
 */
@SpringBootApplication
public class Starter {

    public static void main(String[] args) throws Exception {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
        Assert.isTrue("UTF-8".equals(System.getProperty("file.encoding")));
        Charset charset = Charset.defaultCharset();
        Assert.isTrue(charset.equals(Charset.forName("UTF-8")));
        SpringApplication.run(Starter.class, args);
    }

}
