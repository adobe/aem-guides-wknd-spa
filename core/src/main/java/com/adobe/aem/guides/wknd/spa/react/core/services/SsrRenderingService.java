package com.adobe.aem.guides.wknd.spa.react.core.services;

import java.io.IOException;

import org.apache.commons.lang.NotImplementedException;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.AttributeType;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

public interface SsrRenderingService {
  public static final String DEFAULT_HOST_REACT = "http://localhost:4200";
  public static final boolean DEFAULT_SSR_ENABLED = false;

  default void processSPARequest(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
    throw new NotImplementedException();
  };

  @ObjectClassDefinition(name="Single Page Applications - Server Side Rendering Configuration",
            description = "URLs of the servers responsible for returning the HTML based on the model data send in request")
    @interface Configuration {
        @AttributeDefinition(
                name = "React Node Server URL",
                description = "full URL, i.e. " + DEFAULT_HOST_REACT,
                type = AttributeType.STRING
        )
        String spa_ssr_react_server() default DEFAULT_HOST_REACT;

        @AttributeDefinition(
                name = "SSR Enabled",
                description = "Flag to enable/disable SSR rendering",
                type = AttributeType.BOOLEAN
        )
        boolean ssr_enabled() default DEFAULT_SSR_ENABLED;
    }

}