package myreader.service.search;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import myreader.entity.SubscriptionEntryTagGroup;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.solr.core.SolrOperations;
import org.springframework.data.solr.core.query.Criteria;
import org.springframework.data.solr.core.query.FacetOptions;
import org.springframework.data.solr.core.query.FacetQuery;
import org.springframework.data.solr.core.query.SimpleFacetQuery;
import org.springframework.data.solr.core.query.SimpleFilterQuery;
import org.springframework.data.solr.core.query.result.FacetFieldEntry;
import org.springframework.data.solr.core.query.result.FacetPage;
import org.springframework.stereotype.Repository;
import org.springframework.util.Assert;

/**
 * @author Kamill Sokol
 */
@Repository
public class SubscriptionEntrySearchRepositoryImpl implements SubscriptionEntrySearchRepositoryCustom {

    private static final String TAGS = "tags";

    private final SolrOperations solrOperations;

    @Autowired
    public SubscriptionEntrySearchRepositoryImpl(SolrOperations solrOperations) {
        this.solrOperations = solrOperations;
    }

    @Override
    public Page<SubscriptionEntryTagGroup> findDistinctTagsByUser(Long userId, Pageable pageable) {
        Assert.notNull(userId, "userId is null");
        Assert.notNull(pageable, "pageable is null");

        FacetQuery query = createQuery(userId);
        Page<FacetFieldEntry> result = executeQuery(query);
        Page<FacetFieldEntry> sliced = sliceResult(result, pageable);
        return convertSlice(sliced, pageable);
    }

    private FacetQuery createQuery(Long userId) {
        SimpleFacetQuery query = new SimpleFacetQuery(new Criteria(Criteria.WILDCARD).expression(Criteria.WILDCARD));
        query.setRows(0);
        query.setFacetOptions(new FacetOptions().addFacetOnField(TAGS).setFacetMinCount(1).setFacetLimit(32767));
        query.addFilterQuery(new SimpleFilterQuery(new Criteria("owner_id").is(userId)));
        return query;
    }

    private Page<FacetFieldEntry> executeQuery(FacetQuery query) {
        FacetPage<Object> page = solrOperations.queryForFacetPage(query, Object.class);
        return page.getFacetResultPage(TAGS);
    }

    private Page<FacetFieldEntry> sliceResult(Page<FacetFieldEntry> result, Pageable pageable) {
        List<FacetFieldEntry> content = result.getContent();

        if(content.size() < pageable.getOffset()) {
            return new PageImpl<>(Collections.<FacetFieldEntry>emptyList(), pageable, 0);
        }

        int toIndex =  Math.min((pageable.getOffset() + 1) * pageable.getPageSize(), content.size());
        List<FacetFieldEntry> subList = content.subList(pageable.getOffset(),toIndex);
        return new PageImpl<>(subList, pageable, content.size());
    }

    private Page<SubscriptionEntryTagGroup> convertSlice(Page<FacetFieldEntry> result, Pageable pageable) {
        List<FacetFieldEntry> content = result.getContent();
        List<SubscriptionEntryTagGroup> converted = new ArrayList<>();

        for (FacetFieldEntry facetFieldEntry : content) {
            converted.add(new SubscriptionEntryTagGroup(facetFieldEntry.getValue(), facetFieldEntry.getValueCount()));
        }

        return new PageImpl<>(converted, pageable, result.getTotalElements());
    }

}
