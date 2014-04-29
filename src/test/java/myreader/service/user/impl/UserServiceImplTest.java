package myreader.service.user.impl;

import myreader.service.EntityNotFoundException;
import myreader.service.user.UserServiceImpl;
import myreader.test.UnitTestSupport;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * @author Kamill Sokol
 */
public class UserServiceImplTest extends UnitTestSupport {

    @Autowired
    private UserServiceImpl uut;

    @Test(expected = EntityNotFoundException.class)
    public void testExpectedEntityNotFoundExceptionInMethodFindOne() {
        uut.findOne(42L);
    }
}
