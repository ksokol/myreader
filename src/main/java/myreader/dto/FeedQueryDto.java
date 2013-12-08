package myreader.dto;

import java.math.BigInteger;
import java.util.Date;
import java.util.List;

public class FeedQueryDto {

    private BigInteger id;
    private String url;
    private String title;
    private String lastModified;
    private Long fetched;
    private Long abonnements;
    private List<UserQueryDto> users;
    private Date createdAt;

    public BigInteger getId() {
        return id;
    }

    public void setId(BigInteger id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getLastModified() {
        return lastModified;
    }

    public void setLastModified(String lastModified) {
        this.lastModified = lastModified;
    }

    public Long getFetched() {
        return fetched;
    }

    public void setFetched(Long fetched) {
        this.fetched = fetched;
    }

    public Long getAbonnements() {
        return abonnements;
    }

    public void setAbonnements(Long abonnements) {
        this.abonnements = abonnements;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public List<UserQueryDto> getUsers() {
        return users;
    }

    public void setUsers(List<UserQueryDto> users) {
        this.users = users;
    }

    public static class UserQueryDto {

        private String email;
        private String tag;
        private Integer sum;
        private Long unseen;
        private Date createdAt;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getTag() {
            return tag;
        }

        public void setTag(String tag) {
            this.tag = tag;
        }

        public Integer getSum() {
            return sum;
        }

        public void setSum(Integer sum) {
            this.sum = sum;
        }

        public Long getUnseen() {
            return unseen;
        }

        public void setUnseen(Long unseen) {
            this.unseen = unseen;
        }

        public Date getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(Date createdAt) {
            this.createdAt = createdAt;
        }
    }
}
