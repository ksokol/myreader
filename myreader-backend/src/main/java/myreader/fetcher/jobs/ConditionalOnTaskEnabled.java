package myreader.fetcher.jobs;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

/**
 * @author Kamill Sokol
 */
@ConditionalOnProperty(prefix = "task", name = "enabled", havingValue = "true")
@interface ConditionalOnTaskEnabled { }
