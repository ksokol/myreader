<#import "../layout/reader.ftl" as layout>

<@layout.reader>
   <div class="span4">
       <ul class="nav nav-tabs nav-stacked subscription-tabs">
           <#if treeNavigation.show>
               <#if treeNavigation.selected>
                   <li class="disabled">
                       <a>${treeNavigation.title}</a>
                   </li>
               <#else>
                   <li>
                       <a href="${requestContext.getContextUrl("/${path}/${myreader.uriEncode(treeNavigation.name)}${myreader.toQueryString(queryString)}")}">${treeNavigation.title?html}</a>
                   </li>
               </#if>
           </#if>
           <#list treeNavigation.iterator() as tree>
                   <#if tree.selected>
                       <li class="disabled">
                           <a>
                               ${tree.title?html}
                               <#if tree.hasSelectedNavigationItems>
                                   <i class="icon-chevron-down"></i>
                               <#else>
                                   <#if tree.hasNavigationItems>
                                       <#if tree.hasSelectedNavigationItems>
                                           <#assign cssClass = "icon-chevron-down">
                                       <#else>
                                           <#assign cssClass = "icon-chevron-right">
                                       </#if>
                                       <i data-idx="${tree_index}" class="${cssClass}"></i>
                                   <#else>
                                       <i data-idx="${tree_index}"></i>
                                   </#if>
                               </#if>
                           </a>
                       </li>
                   <#else>
                       <li>
                           <a href="${requestContext.getContextUrl("/${path}/${myreader.uriEncode(tree.name)}${myreader.toQueryString(queryString)}")}">
                               ${tree.title?html}
                               <#if tree.hasNavigationItems>
                                   <#if tree.hasSelectedNavigationItems>
                                       <#assign cssClass = "icon-chevron-down">
                                   <#else>
                                       <#assign cssClass = "icon-chevron-right">
                                   </#if>
                                   <i data-idx="${tree_index}" class="${cssClass}"></i>
                               <#else>
                                   <i data-idx="${tree_index}"></i>
                               </#if>
                           </a>
                       </li>
                   </#if>
                <#list tree.iterator() as child>
                   <#if child.selected>
                        <#if tree.hasSelectedNavigationItems>
                            <#assign cssClass = "" />
                        <#else>
                            <#assign cssClass = "hidden" />
                        </#if>
                       <li class="disabled leaf leaf-${tree_index} ${cssClass}">
                           <a>${child.title?html}</a>
                       </li>
                   <#else>
                       <#if tree.hasSelectedNavigationItems>
                           <#assign cssClass = "" />
                       <#else>
                           <#assign cssClass = "hidden" />
                       </#if>
                       <li class="leaf leaf-${tree_index} ${cssClass}">
                           <a href="${requestContext.getContextUrl("/${path}/${myreader.uriEncode(child.name)}${myreader.toQueryString(queryString)}")}">
                               ${child.title?html}
                           </a>
                       </li>
                   </#if>
                </#list>
           </#list>
       </ul>
   </div>

    <div class="span8">
        <#include "collection.ftl" />
    </div>

    <div class="modal hide" id="modal">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h3>Edit</h3>
        </div>

        <div class="modal-body"></div>

        <div class="modal-footer">
            <a id="modal-close" data-dismiss="modal" href="#" class="btn">Close</a>
            <a id="modal-save" href="#" class="btn btn-primary">Save</a>
        </div>
    </div>
</@layout.reader>
