package myreader.fetcher.impl;

import myreader.entity.FetchStatistics;
import myreader.repository.FetchStatisticRepository;
import myreader.service.time.TimeService;
import org.aopalliance.intercept.MethodInterceptor;
import org.aopalliance.intercept.MethodInvocation;
import org.springframework.util.Assert;

/**
 * @author Kamill Sokol
 */
public class FetchStatisticsMethodInterceptor implements MethodInterceptor {

    private final FetchStatisticRepository fetchStatisticRepository;
    private final TimeService timeService;

    public FetchStatisticsMethodInterceptor(final FetchStatisticRepository fetchStatisticRepository, final TimeService timeService) {
        Assert.notNull(fetchStatisticRepository, "fetchStatisticRepository is null");
        Assert.notNull(timeService, "timeService is null");

        this.fetchStatisticRepository = fetchStatisticRepository;
        this.timeService = timeService;
    }

    @Override
    public Object invoke(final MethodInvocation invocation) throws Throwable {
        final String url = String.valueOf(invocation.getArguments()[0]);
        FetchStatistics fetchStatistics = new FetchStatistics();

        fetchStatistics.setStartedAt(timeService.getCurrentTime());
        fetchStatistics.setUrl(url);
        fetchStatistics.setIssuer(Thread.currentThread().getName());

        try {
            return invocation.proceed();
        } catch (Exception e) {
            fetchStatistics.setMessage(e.getMessage());
            fetchStatistics.setStoppedAt(timeService.getCurrentTime());
            fetchStatisticRepository.save(fetchStatistics);
            throw e;
        }
    }
}
