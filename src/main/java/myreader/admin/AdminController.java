package myreader.admin;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(value = "web/admin")
class AdminController {

    @Autowired
    private AdminApi adminApi;

    @RequestMapping(value = "", method = GET)
    String index(Map<String, Object> model) {
        model.put("queue", adminApi.index());
        return "admin/index";
    }

    @RequestMapping(value = "feeds", method = GET)
    String feeds(Map<String, Object> model) {
        model.put("feedList", adminApi.feeds());
        return "admin/feeds";
    }
}
