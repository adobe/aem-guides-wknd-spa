package com.adobe.aem.guides.wknd.spa.react.core.models.impl;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.drew.lang.annotations.NotNull;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.*;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;


/**
 * This file focuses on making a Sling Model compatible with AEM Content Services (and thus SPA Editor), as this requires:
 * a) Implementing the ComponentExporter interface.
 *
 * Note that these is a sibling interface to ComponentExporter, com.adobe.cq.export.json.ContainerExporter, that is used for components that included other components (like the Layout Container).
 *
 * For more detailed examples of Sling Models and Sling Model Exporters, see this file's sibling sample files (SampleSlingModel.class and SampleSlingModelExporter.class).
 */
@Model(
        // This must adapt from a SlingHttpServletRequest, since this is invoked directly via a request, and not via a resource.
        // If can specify Resource.class as a second adaptable as needed
        adaptables = { SlingHttpServletRequest.class },

        // This Model should have the specific Model class (SampleComponentExporter.class)
        // AS WELL AS the ComponentExporter.class. Its required that ComponentExporter.class to be set at an adapter
        // since this how the AEM Content Services JSON Exporter figures out which resources to serialize.
        adapters = { BaseComponentExporter.class, ComponentExporter.class },

        // The resourceType is required if you want Sling to "naturally" expose this model as the exporter for a Resource.
        resourceType = BaseComponentExporter.RESOURCE_TYPE,

        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
)
// name = the registered name of the exporter (  ExporterConstants.SLING_MODEL_EXPORTER_NAME => jackson )
// extensions = the extensions this exporter is registered to (ExporterConstants.SLING_MODEL_EXTENSION => json)
// selector = defaults to "model", can override as needed; This is helpful if a single resource needs 2 different JSON renditions.
//            (ExporterConstants.SLING_MODEL_SELECTOR => model)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
          selector = ExporterConstants.SLING_MODEL_SELECTOR, // The default is 'model', this is just reiterating this.
          extensions = ExporterConstants.SLING_MODEL_EXTENSION,
          options = {   // options are optional... this just shows that it is possible...
                        /**
                         * Jackson options:
                         * - Mapper Features: http://static.javadoc.io/com.fasterxml.jackson.core/jackson-databind/2.8.5/com/fasterxml/jackson/databind/MapperFeature.html
                         * - Serialization Features: http://static.javadoc.io/com.fasterxml.jackson.core/jackson-databind/2.8.5/com/fasterxml/jackson/databind/SerializationFeature.html
                         */
                        @ExporterOption(name = "MapperFeature.SORT_PROPERTIES_ALPHABETICALLY", value = "true"),
                        @ExporterOption(name = "SerializationFeature.WRITE_DATES_AS_TIMESTAMPS", value="false")
          }
)


// Mark as JSON Serializable as the Model's class (SampleComponentExporter.class) or interface if those are used.
@JsonSerialize(as = BaseComponentExporter.class)

// Make sure the Model implementation implements (or the Model interface extends) com.adobe.cq.export.json.ComponentExporter.
public class BaseComponentExporter implements ComponentExporter {
    static final String RESOURCE_TYPE = "wknd-events/base/component-exporter";

    @Self
    private SlingHttpServletRequest request;

    @Self
    private Resource resource;

    // Injection will occur over all Injectors based on Ranking;
    // Force an Injector using @Source(..)
    // If an Injector is not working; ensure you are using the latest version of Sling Models
    @SlingObject
    @Required
    private ResourceResolver resourceResolver;

    @NotNull
    @Override
    public String getExportedType() {
        // This method is required by ComponentExporter and its value populates the `:type` key in the JSON object.
        // The resource value is ~always the ResourceType for this model (See @Model(..) above).
        return request.getResource().getResourceType();
    }

    /**
     * Jackson Annotations on the method level are supported; ie. @JsonIgnore, @JsonProperty(..), etc.
     *
     * For Jackson Annotations: https://github.com/FasterXML/jackson-annotations/wiki/Jackson-Annotations
     */
    public String getMessage() {
        return String.format("Hi! from %s! I don't have my own exporter class and am inheriting the default behavior from BaseComponentExporter.java", request.getResource().getResourceType());
    }
    
}