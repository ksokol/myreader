package myreader.fetcher.impl;

import myreader.entity.FetchStatistics;
import myreader.fetcher.persistence.FetchResult;
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
        final FetchResult fetchResult = (FetchResult) invocation.getArguments()[0];
        FetchStatistics fetchStatistics = new FetchStatistics();

        fetchStatistics.setStartedAt(timeService.getCurrentTime());
        fetchStatistics.setUrl(fetchResult.getUrl());
        fetchStatistics.setType(FetchStatistics.Type.ENTRY_LIST);
        fetchStatistics.setFetchCount(0L);
        fetchStatistics.setIssuer(Thread.currentThread().getName());

        try {
            final long result = (long) invocation.proceed();

            fetchStatistics.setFetchCount(result);
            fetchStatistics.setResult(FetchStatistics.Result.SUCCESS);

            return result;
        } catch (Exception e) {
            fetchStatistics.setMessage(e.getMessage());
            fetchStatistics.setResult(FetchStatistics.Result.ERROR);
            fetchStatistics.setFetchCount(0L);
            throw e;
        } finally {
            fetchStatistics.setStoppedAt(timeService.getCurrentTime());
            fetchStatisticRepository.save(fetchStatistics);
        }
    }
}
