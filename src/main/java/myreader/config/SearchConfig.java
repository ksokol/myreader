package myreader.config;

import org.apache.solr.client.solrj.SolrServer;
import org.apache.solr.client.solrj.embedded.EmbeddedSolrServer;
import org.apache.solr.core.ConfigSolr;
import org.apache.solr.core.CoreContainer;
import org.apache.solr.core.SolrResourceLoader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.File;
import java.io.IOException;

/**
 * @author dev@sokol-web.de <Kamill Sokol>
 */
@Configuration
public class SearchConfig {

    private static final String SOLR_XML = "solr/solr.xml";
    private static final Logger log = LoggerFactory.getLogger(SearchConfig.class);

    @Bean
    public CoreContainer coreContainer() throws IOException {
        File home = new ClassPathResource(SOLR_XML).getFile();
        log.info("looking for cores in " + home.getParent());
        SolrResourceLoader loader = new SolrResourceLoader(home.getParent());
        ConfigSolr config = ConfigSolr.fromSolrHome(loader, loader.getInstanceDir());
        CoreContainer cores = new CoreContainer(loader, config);
        cores.load();
        return cores;
    }

    @Bean
    public SolrServer solrServer() throws IOException {
        return new EmbeddedSolrServer(coreContainer(), "");
    }
}
