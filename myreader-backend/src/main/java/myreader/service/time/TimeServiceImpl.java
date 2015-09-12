package myreader.service.time;

import org.springframework.stereotype.Service;

import java.util.Date;

/**
 * @author Kamill Sokol
 */
@Service
public class TimeServiceImpl implements TimeService {

    @Override
    public Date getCurrentTime() {
        return new Date();
    }
}
