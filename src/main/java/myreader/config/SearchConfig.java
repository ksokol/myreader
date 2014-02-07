package myreader.config;

import org.apache.solr.client.solrj.SolrServer;
import org.apache.solr.client.solrj.embedded.EmbeddedSolrServer;
import org.apache.solr.core.ConfigSolr;
import org.apache.solr.core.CoreContainer;
import org.apache.solr.core.SolrResourceLoader;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.File;
import java.io.IOException;
import java.util.logging.Logger;

/**
 * @author dev@sokol-web.de <Kamill Sokol>
 */
@Configuration
public class SearchConfig {

    private static final String SOLR_XML = "solr/solr.xml";
    private static final Logger log = Logger.getLogger(SearchConfig.class.getName());

    private CoreContainer cores;

    public SearchConfig() throws IOException {
        File home = new ClassPathResource(SOLR_XML).getFile();
        log.info("looking for cores in " + home.getParent());
        SolrResourceLoader loader = new SolrResourceLoader(home.getParent());
        ConfigSolr config = ConfigSolr.fromSolrHome(loader, loader.getInstanceDir());
        cores = new CoreContainer(loader, config);
        cores.load();
    }

    @Bean
    public CoreContainer coreContainer() {
        return cores;
    }

    @Bean
    public SolrServer solrServer() {
        return new EmbeddedSolrServer(cores, "");
    }
}
