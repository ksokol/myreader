package myreader.entity;

import org.apache.solr.client.solrj.beans.Field;

import java.util.Date;

/**
 * @author Kamill Sokol
 */
public class SearchableSubscriptionEntry {

	@Field
	private Long id;

	@Field("owner_id")
	private Long ownerId;

	@Deprecated
	@Field
	private String owner;

	@Field("feed_id")
	private Long subscriptionId;

	@Field("url")
	private String url;

	@Field("subscription_title")
	private String subscriptionTitle;

	@Field
	private String title;

	@Field
	private String content;

	@Field
	private boolean seen;

	@Field
	private String tag;

	@Field("created_at")
	private Date createdAt;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(Long ownerId) {
		this.ownerId = ownerId;
	}

	@Deprecated
	public String getOwner() {
		return owner;
	}

	@Deprecated
	public void setOwner(String owner) {
		this.owner = owner;
	}

	public Long getSubscriptionId() {
		return subscriptionId;
	}

	public void setSubscriptionId(Long subscriptionId) {
		this.subscriptionId = subscriptionId;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getSubscriptionTitle() {
		return subscriptionTitle;
	}

	public void setSubscriptionTitle(String subscriptionTitle) {
		this.subscriptionTitle = subscriptionTitle;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public boolean isSeen() {
		return seen;
	}

	public void setSeen(boolean seen) {
		this.seen = seen;
	}

	public String getTag() {
		return tag;
	}

	public void setTag(String tag) {
		this.tag = tag;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}
}
