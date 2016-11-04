package myreader.controller;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.web.ErrorController;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import static org.hamcrest.Matchers.instanceOf;
import static org.junit.Assert.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest
public class CustomErrorControllerIT {

    @Autowired
    private ErrorController errorController;

    @Test
    public void shouldContainsInstanceOfCustomErrorControllerAsErrorControllerInApplication() throws Exception {
        assertThat(errorController, instanceOf(CustomErrorController.class));
    }

}
