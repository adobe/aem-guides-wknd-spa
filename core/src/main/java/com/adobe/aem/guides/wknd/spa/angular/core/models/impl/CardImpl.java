package com.adobe.aem.guides.wknd.spa.angular.core.models.impl;

import java.util.Calendar;

import javax.annotation.PostConstruct;

import com.adobe.aem.guides.wknd.spa.angular.core.models.Card;
import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.wcm.core.components.models.Image;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import javax.inject.Named;
import org.apache.sling.models.annotations.*;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.apache.sling.models.annotations.via.ResourceSuperType;

@Model(adaptables = SlingHttpServletRequest.class, adapters = { Card.class,
        ComponentExporter.class }, resourceType = CardImpl.RESOURCE_TYPE, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class CardImpl implements Card {

    static final String RESOURCE_TYPE = "wknd-spa-angular/components/card";

    @Self
    private SlingHttpServletRequest request;

    @Self
    @Via(type = ResourceSuperType.class)
    private Image image;

    @ValueMapValue
    private String linkURL;

    @ValueMapValue
    private boolean titleFromPage;

    @ValueMapValue
    private String pageTitle;

    @ValueMapValue
    private String linkText;

    @ScriptVariable
    PageManager pageManager;

    /***
     * The underlying page linked by the card
     */
    private Page linkedPage;

    @PostConstruct
    public void initModel() {
        if(StringUtils.isNotBlank(this.linkURL) && pageManager != null) {
            linkedPage = pageManager.getPage(this.linkURL);
        }
    }

    @Override
    public String getSrc() {
        return null != image ? image.getSrc() : null;
    }

    @Override
    public String getAlt() {
        return null != image ? image.getAlt() : null;
    }

    @Override
    public String getTitle() {
        if (null == image) {
            return null;
        }
        return image.getTitle();
    }

    @Override
    public String getUuid() {
        return null != image ? image.getUuid() : null;
    }

    @Override
    public String getLink() {
        return null != image ? image.getLink() : null;
    }

    @Override
    public boolean displayPopupTitle() {
        return null != image ? image.displayPopupTitle() : false;
    }

    @Override
    public int[] getWidths() {
        return null != image ? image.getWidths() : null;
    }

    @Override
    public String getSrcUriTemplate() {
        return null != image ? image.getSrcUriTemplate() : null;
    }

    @Override
    public boolean isLazyEnabled() {
        return null != image ? image.isLazyEnabled() : false;
    }

    @Override
    public String getExportedType() {
        return CardImpl.RESOURCE_TYPE;
    }

    @Override
    public String getPageTitle() {
       if(linkedPage != null && titleFromPage) {
           return linkedPage.getTitle();
       }
       return pageTitle;
    }

    @Override
    public Calendar getPageLastModified() {
        if(linkedPage != null) {
            return linkedPage.getLastModified();
        }
        return null;
    }

    @Override
    public String getLinkText() {
        return linkText;
    }
    
}