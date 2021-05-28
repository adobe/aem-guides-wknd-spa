/*
 *  Copyright 2021 Adobe Systems Incorporated
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.adobe.aem.guides.wkndspa.angular.core.models;

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