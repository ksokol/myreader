package myreader.reader.web;

import myreader.API;
import org.apache.solr.common.SolrException;
import org.apache.solr.common.params.CommonParams;
import org.apache.solr.common.params.MapSolrParams;
import org.apache.solr.common.params.ModifiableSolrParams;
import org.apache.solr.common.params.SolrParams;
import org.apache.solr.common.util.ContentStreamBase;
import org.apache.solr.common.util.NamedList;
import org.apache.solr.common.util.SimpleOrderedMap;
import org.apache.solr.core.CoreContainer;
import org.apache.solr.core.SolrConfig;
import org.apache.solr.core.SolrCore;
import org.apache.solr.handler.ContentStreamHandlerBase;
import org.apache.solr.request.*;
import org.apache.solr.response.BinaryQueryResponseWriter;
import org.apache.solr.response.QueryResponseWriter;
import org.apache.solr.response.SolrQueryResponse;
import org.apache.solr.servlet.ResponseUtils;
import org.apache.solr.servlet.SolrRequestParsers;
import org.apache.solr.servlet.cache.HttpCacheHeaderUtil;
import org.apache.solr.servlet.cache.Method;
import org.apache.solr.util.FastWriter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import static myreader.service.search.SolrSubscriptionFields.*;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.nio.charset.Charset;
import java.util.*;

@Component
@RequestMapping(API.V1 + "solr")
public class SolrController {

    private static final Charset UTF8 = Charset.forName("UTF-8");
    private final Logger log = LoggerFactory.getLogger(SolrController.class);

    private final Map<SolrConfig, SolrRequestParsers> parsers = new WeakHashMap<SolrConfig, SolrRequestParsers>();
    private CoreContainer cores;

    @Autowired
    public SolrController(CoreContainer cores) {
        this.cores = cores;
    }

    @RequestMapping("{core}/{handler}")
    public void select(@PathVariable String core, @PathVariable String handler, HttpServletRequest req, HttpServletResponse resp, Authentication authentication) throws IOException {
        SolrCore solrCore = null;
        SolrQueryRequest solrReq = null;
        SolrRequestHandler coreHandler;

        try {
            // put the core container in request attribute
            req.setAttribute("org.apache.solr.CoreContainer", cores);

            solrCore = cores.getCore(core);

            if(solrCore == null) {
                throw new SolrException( SolrException.ErrorCode.BAD_REQUEST, String.format("core %s not found", core));
            }

            final SolrConfig config = solrCore.getSolrConfig();
            // get or create/cache the parser for the core
            SolrRequestParsers parser = null;
            parser = parsers.get(config);
            if( parser == null ) {
                parser = new SolrRequestParsers(config);
                parsers.put(config, parser);
            }

            coreHandler = solrCore.getRequestHandler( "/"+handler );
            // no handler yet but allowed to handle select; let's check
            if( coreHandler == null && parser.isHandleSelect() ) {
                if( "select".equals( handler ) || "select/".equals( handler ) ) {
                    solrReq = parser.parse( solrCore, "/"+handler, req );
                    String qt = solrReq.getParams().get( CommonParams.QT );
                    coreHandler = solrCore.getRequestHandler( qt );
                    if( coreHandler == null ) {
                        throw new SolrException( SolrException.ErrorCode.BAD_REQUEST, "unknown handler: "+qt);
                    }
                    if( qt != null && qt.startsWith("/") && (coreHandler instanceof ContentStreamHandlerBase)) {
                        //For security reasons it's a bad idea to allow a leading '/', ex: /select?qt=/update see SOLR-3161
                        //There was no restriction from Solr 1.4 thru 3.5 and it's not supported for update handlers.
                        throw new SolrException( SolrException.ErrorCode.BAD_REQUEST, "Invalid Request Handler ('qt').  Do not use /select to access: "+qt);
                    }
                }
            }

            if(coreHandler == null) {
                throw new SolrException( SolrException.ErrorCode.BAD_REQUEST, String.format("unknown handler: %s", handler));
            }

            // if not a /select, create the request
            if( solrReq == null ) {
                solrReq = parser.parse( solrCore, handler, req );
            }

            final Method reqMethod = Method.getMethod(req.getMethod());
            HttpCacheHeaderUtil.setCacheControlHeader(config, resp, reqMethod);
            // unless we have been explicitly told not to, do cache validation
            // if we fail cache validation, execute the query
            if (config.getHttpCachingConfig().isNever304() ||
                    !HttpCacheHeaderUtil.doCacheHeaderValidation(solrReq, req, reqMethod, resp)) {
                SolrQueryResponse solrRsp = new SolrQueryResponse();
                SolrRequestInfo.setRequestInfo(new SolrRequestInfo(solrReq, solrRsp));
                this.execute( req, coreHandler, solrReq, solrRsp, authentication );
                HttpCacheHeaderUtil.checkHttpCachingVeto(solrRsp, resp, reqMethod);
                // add info to http headers

                QueryResponseWriter responseWriter = solrCore.getQueryResponseWriter(solrReq);
                writeResponse(solrRsp, resp, responseWriter, solrReq, reqMethod);
            }
            return; // we are done with a valid handler
        }
        catch (Throwable ex) {
            sendError( solrCore, solrReq, req, resp, ex );
            return;
        }
        finally {
            if( solrReq != null ) {
                log.debug("Closing out SolrRequest: {}", solrReq);
                solrReq.close();
            }
            if (solrCore != null) {
                solrCore.close();
            }
            SolrRequestInfo.clearRequestInfo();
        }
    }

    private void writeResponse(SolrQueryResponse solrRsp, ServletResponse response,
                               QueryResponseWriter responseWriter, SolrQueryRequest solrReq, Method reqMethod)
            throws IOException {

        // Now write it out
        final String ct = responseWriter.getContentType(solrReq, solrRsp);
        // don't call setContentType on null
        if (null != ct) response.setContentType(ct);

        if (solrRsp.getException() != null) {
            NamedList info = new SimpleOrderedMap();
            int code = ResponseUtils.getErrorInfo(solrRsp.getException(), info, log);
            solrRsp.add("error", info);
            ((HttpServletResponse) response).setStatus(code);
        }

        if (Method.HEAD != reqMethod) {
            if (responseWriter instanceof BinaryQueryResponseWriter) {
                BinaryQueryResponseWriter binWriter = (BinaryQueryResponseWriter) responseWriter;
                binWriter.write(response.getOutputStream(), solrReq, solrRsp);
            } else {
                String charset = ContentStreamBase.getCharsetFromContentType(ct);
                Writer out = (charset == null || charset.equalsIgnoreCase("UTF-8"))
                        ? new OutputStreamWriter(response.getOutputStream(), UTF8)
                        : new OutputStreamWriter(response.getOutputStream(), charset);
                out = new FastWriter(out);
                responseWriter.write(out, solrReq, solrRsp);
                out.flush();
            }
        }
        //else http HEAD request, nothing to write out, waited this long just to get ContentType
    }

    private void execute(HttpServletRequest req, SolrRequestHandler handler, SolrQueryRequest sreq, SolrQueryResponse rsp, Authentication authentication) {
        // a custom filter could add more stuff to the request before passing it on.
        // for example: sreq.getContext().put( "HttpServletRequest", req );
        // used for logging query stats in SolrCore.execute()
        ModifiableSolrParams mapSolrParams = new ModifiableSolrParams(sreq.getParams());
        mapSolrParams.add("fq", owner(authentication.getName()));

        sreq.setParams(mapSolrParams);

        sreq.getContext().put("webapp", req.getContextPath());
        sreq.getCore().execute( handler, sreq, rsp );
    }

    protected void sendError(SolrCore core,
                             SolrQueryRequest req,
                             ServletRequest request,
                             HttpServletResponse response,
                             Throwable ex) throws IOException {
        try {
            SolrQueryResponse solrResp = new SolrQueryResponse();
            if(ex instanceof Exception) {
                solrResp.setException((Exception)ex);
            }
            else {
                solrResp.setException(new RuntimeException(ex));
            }
            if(core==null) {
                core = cores.getCore(""); // default core
            }
            if(req==null) {
                final SolrParams solrParams;
                if (request instanceof HttpServletRequest) {
                    // use GET parameters if available:
                    solrParams = SolrRequestParsers.parseQueryString(((HttpServletRequest) request).getQueryString());
                } else {
                    // we have no params at all, use empty ones:
                    solrParams = new MapSolrParams(Collections.<String,String>emptyMap());
                }
                req = new SolrQueryRequestBase(core, solrParams) {};
            }
            QueryResponseWriter writer = core.getQueryResponseWriter(req);
            writeResponse(solrResp, response, writer, req, Method.GET);
        }
        catch( Throwable t ) { // This error really does not matter
            SimpleOrderedMap info = new SimpleOrderedMap();
            int code = ResponseUtils.getErrorInfo(ex, info, log);
            response.sendError( code, info.toString() );
        }
    }
}
