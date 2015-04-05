<#import "../layout/page.ftl" as layout>

<@layout.page>
    <script>
        $(document).ready(function() {
            $("#feed_table").tablesorter();
            $('.feed_user_detail').on('click', function(e) {
                $(this).toggleClass('icon-chevron-right').toggleClass('icon-chevron-down').parent().parent().next().toggleClass('hidden');
            });
        });
    </script>
    <table id="feed_table" class="table table-condensed table-hover tablesorter">
        <thead>
        <tr>
            <th>Title</th>
            <th>Last Modified</th>
            <th>Fetched</th>
            <th>Abonnements</th>
            <th>Created at</th>
        </tr>
        </thead>
        <tbody>
        <#list feedList as feed>
            <tr>
                <td><a target="_blank" href="${feed.url}">${feed.title?html}</a></td>
                <td><#if feed.lastModified??>${feed.lastModified}</#if></td>
                <td>${feed.fetched?string.computer}</td>
                <td>${feed.abonnements?string.computer}</td>
                <td>${feed.createdAt?datetime}</td>
            </tr>
        </#list>
        </tbody>
    </table>
</@layout.page>
