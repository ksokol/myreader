<#macro errors path>
    <#if bindingResult?? && bindingResult.getFieldError(path)??>
        <span>${bindingResult.getFieldError(path).defaultMessage}</span>
    </#if>
</#macro>
