package org.springframework.boot.context.embedded.jetty;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.ServerConnector;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.embedded.EmbeddedServletContainerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author Kamill Sokol
 */
@Deprecated
@Configuration
public class JettyConfiguration {

    private int port;

    @Bean
    public EmbeddedServletContainerFactory embeddedServletContainerFactory() throws Exception {
        return new JettyEmbeddedServletContainerFactory() {
            @Override
            protected JettyEmbeddedServletContainer getJettyEmbeddedServletContainer(Server server) {
                ServerConnector connector = new ServerConnector(server);
                connector.setPort(port);
                server.addConnector(connector);
                return super.getJettyEmbeddedServletContainer(server);
            }
        };
    };

    @Value("${custom.server.http.port}")
    @Required
    public void setPort(final int port) {
        this.port = port;
    }
}
