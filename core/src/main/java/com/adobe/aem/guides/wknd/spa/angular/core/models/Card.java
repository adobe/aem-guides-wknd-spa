package com.adobe.aem.guides.wknd.spa.angular.core.models;

import java.util.Calendar;
import com.adobe.cq.wcm.core.components.models.Image;
import org.osgi.annotation.versioning.ProviderType;


@ProviderType
public interface Card extends Image {

    /***
     * The URL to populate the CTA button as part of the card.
     * The link should be based on the cardPath property that points to a page.
     * @return String URL
     */
    public String getCtaLinkURL();

    /***
     * The text to display on the CTA button of the card.
     * @return String CTA text
     */
    public String getCtaText();



    /***
     * The date to be displayed as part of the card. 
     * This is based on the last modified date of the page specified by the cardPath
     * @return 
     */
    public Calendar getCardLastModified();


    /**
     * Return the title of the page specified by cardPath if `titleFromPage` is set to true.
     * Otherwise return the value of `cardTitle` 
     * @return
     */
    public String getCardTitle();
}