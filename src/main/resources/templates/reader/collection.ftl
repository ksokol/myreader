<#if entryList?has_content>
    <table id="subscription-table" class="table">
        <thead>
            <tr>
                <th></th>
            </tr>
        </thead>
        <#if entryList?size == 10>
            <tfoot>
                <tr>
                    <td>
                        <div class="well well-small">
                            <#if queryString['q']?has_content>
                                <#if offset??>
                                    <#assign offsetValue = "$offset=${offset?string.computer}">
                                <#else>
                                    <#assign offsetValue ="">
                                </#if>
                                <a class="more" href="${myreader.toQueryString(queryString)}${offsetValue}">more</a>
                            </#if>
                            <#if !queryString['q']?has_content>
                                <a class="more" href="${myreader.toQueryString(queryString)}&offset=${entryList[9].id?string.computer}">more</a>
                            </#if>
                        </div>
                    </td>
                </tr>
            </tfoot>
        </#if>
        <tbody>
            <#list entryList as entry>
                <tr data-entry-id="${entry.id?string.computer}" data-reader-unseen="${entry.unseen}">
                    <td>
                        <#if queryString.showDetails>
                            <#assign showDetailsCssClass = "">
                        <#else>
                            <#assign showDetailsCssClass = "hidden">
                        </#if>
                        <div class="entry-bar ${showDetailsCssClass}">
                            <div class="reader-unseen-flag">
                                <#assign unseenValue = true></assign>
                                <#if entry.unseen == "true">
                                    <#assign cssClass = "">
                                    <#assign cssClass2 = "hidden">
                                <#else>
                                    <#assign unseenValue = false></assign>
                                    <#assign cssClass = "hidden">
                                    <#assign cssClass2 = "">
                                </#if>
                                <a class="${cssClass}" href="${requestContext.getContextUrl("/web/entry/edit?id=${entry.id?string.computer}&unseen=true")}"><i class="icon-eye-open"></i> <span>unseen</span></a>
                                <a class="${cssClass2}" href="${requestContext.getContextUrl("/web/entry/edit?id=${entry.id?string.computer}&unseen=false")}"><i class="icon-eye-close"></i> <span>seen</span></a>
                            </div>

                            <a data-toggle="modal" data-target="#modal" href="${requestContext.getContextUrl("/web/entry/edit?id=${entry.id?string.computer}")}" class="reader-tag">
                                <i class="icon-tag"></i>
                                <span><#if entry.tag??>${entry.tag?html}</#if></span>
                            </a>

                            <div class="pull-right">
                                ${myreader.timeAgo(entry.createdAt)} ${entry.feedTitle?html}
                            </div>
                        </div>

                        <h5>
                            <a target="_blank" href="${entry.url}">${entry.title?html}</a>
                        </h5>

                        <div class="entry-content ${showDetailsCssClass}">
                            <div class='clearfix'><#if entry.content??>${entry.content}</#if></div>
                        </div>
                    </td>
                </tr>
            </#list>
        </tbody>
    </table>
</#if>
