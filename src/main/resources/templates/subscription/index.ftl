<#import "../layout/reader.ftl" as layout>

<@layout.reader>
    <div class="pull-right">
        <a href="${requestContext.getContextUrl("/web/subscription/edit")}" class="btn">Add subscription</a>
    </div>
    <table id="subscription-table" class="table table-condensed table-hover tablesorter table-subscription">
        <colgroup>
            <col width="2%">
            <col width="2%">
            <col width="40%">
            <col width="15%">
            <col width="5%">
            <col width="10%">
            <col width="15%">
        </colgroup>
        <thead>
        <tr>
            <th></th>
            <th></th>
            <th>Title</th>
            <th>Tag</th>
            <th>Sum</th>
            <th>Exclusions</th>
            <th>Created At</th>
        </tr>
        </thead>
        <tbody>
        <#list subscriptionList as subscription>
            <tr>
                <td>${subscription_index + 1}.</td>
                <td><a href="${requestContext.getContextUrl("/web/subscription/edit?id=${subscription.id?string.computer}")}"><i class="icon-edit"></i></a></td>
                <td><a target="_blank" href="${subscription.url}">${subscription.title?html}</a></td>
                <td><#if subscription.tag??>${subscription.tag?html}</#if></td>
                <td>${subscription.sum}</td>
                <td>0</td>
                <td>${subscription.createdAt?datetime}</td>
            </tr>
        </#list>
        </tbody>
    </table>
    <div class="pull-right">
        <a href="${requestContext.getContextUrl("/web/subscription/edit")}" class="btn">Add subscription</a>
    </div>
</@layout.reader>
