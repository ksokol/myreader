package myreader.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table(name = "fetch_statistics")
public class FetchStatistics {

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private String issuer;

    @Column(nullable = false)
    private String url;

    @Column(columnDefinition = "int default '0'", nullable = false)
    private Long fetchCount;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date startedAt;

    @Temporal(TemporalType.TIMESTAMP)
    private Date stoppedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Result result;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Type type;

    @Column(columnDefinition = "LONGTEXT")
    private String message;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIssuer() {
        return issuer;
    }

    public void setIssuer(String issuer) {
        this.issuer = issuer;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Long getFetchCount() {
        return fetchCount;
    }

    public void setFetchCount(Long fetchCount) {
        this.fetchCount = fetchCount;
    }

    public Date getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(Date startedAt) {
        this.startedAt = startedAt;
    }

    public Date getStoppedAt() {
        return stoppedAt;
    }

    public void setStoppedAt(Date stoppedAt) {
        this.stoppedAt = stoppedAt;
    }

    public Result getResult() {
        return result;
    }

    public void setResult(Result result) {
        this.result = result;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public enum Result {
        SUCCESS, ERROR;
    }

    public enum Type {
        REFRESH, ENTRY_LIST;
    }

}
