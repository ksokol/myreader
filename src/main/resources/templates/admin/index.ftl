<#import "../layout/page.ftl" as layout>

<@layout.page>
    <div class="span3 bs-docs-sidebar">
        <ul class="nav nav-list bs-docs-sidenav affix-top">
            <li>Queue Size: ${queue.size}</li>
        </ul>
    </div>
    <table id="feed_table" class="table table-condensed table-hover tablesorter">
        <thead>
            <tr>
                <th>Url</th>
            </tr>
        </thead>
        <tbody>
            <#list queue.queued as item>
                <tr>
                    <td><a target="_blank" href="${item}">${item}</a></td>
                </tr>
            </#list>
        </tbody>
    </table>
</@layout.page>
