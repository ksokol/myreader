package myreader.fetcher.jobs;
//package myreader.core.jobs;
//
//import org.springframework.context.ApplicationListener;
//import org.springframework.context.event.ContextClosedEvent;
//import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
//import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
//
////@Component
//class TaskExecutor implements ApplicationListener<ContextClosedEvent> {
//    //http://stackoverflow.com/questions/6603051/how-can-i-shutdown-spring-task-executor-scheduler-pools-before-all-other-beans-i
//
//    //@Autowired
//    ThreadPoolTaskExecutor taskExecutor;
//    // @Autowired
//    ThreadPoolTaskScheduler myScheduler;
//
//    @Override
//    public void onApplicationEvent(ContextClosedEvent event) {
//        System.out.println("-------------shutdown");
//        myScheduler.shutdown();
//        taskExecutor.shutdown();
//    }
//
//}
