package myreader.fetcher.icon.impl;

import java.util.Collections;
import java.util.List;

import myreader.fetcher.icon.IconResult;
import myreader.fetcher.icon.IconService;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.OrderComparator;
import org.springframework.stereotype.Service;

@Service
public class IconServiceImpl implements IconService, InitializingBean {

    @Autowired
    private List<IconFinder> finder;

    @Autowired
    private DefaultIconProvider defaultIconProvider;

    @Override
    public IconResult findByUrl(String url) {
        DomainIterator iterator = new DomainIterator(url);
        IconResult found = null;

        while (iterator.hasNext()) {
            String next = iterator.next();

            for (IconFinder strategy : finder) {
                found = strategy.find(next);

                if (found != null) {
                    return found;
                }
            }
        }

        return defaultIconProvider.get();
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        Collections.sort(finder, new OrderComparator());
    }
}
