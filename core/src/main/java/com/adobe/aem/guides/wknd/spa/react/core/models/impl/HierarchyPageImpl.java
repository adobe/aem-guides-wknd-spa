package com.adobe.aem.guides.wknd.spa.react.core.models.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;
import javax.inject.Inject;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.request.RequestParameter;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.wrappers.SlingHttpServletRequestWrapper;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.factory.ModelFactory;

import com.adobe.aem.guides.wknd.spa.react.core.models.HierarchyPage;
import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ContainerExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.export.json.SlingModelFilter;
import com.adobe.cq.export.json.hierarchy.type.HierarchyTypes;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.api.Template;
import com.day.cq.wcm.api.TemplatedResource;
import com.day.cq.wcm.api.components.ComponentContext;
import com.day.cq.wcm.api.designer.Style;
import com.day.cq.wcm.api.policies.ContentPolicy;
import com.day.cq.wcm.api.policies.ContentPolicyManager;
import com.drew.lang.annotations.NotNull;
import com.drew.lang.annotations.Nullable;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Model(adaptables = SlingHttpServletRequest.class, adapters = {HierarchyPage.class, ContainerExporter.class}, resourceType = HierarchyPageImpl.RESOURCE_TYPE)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class HierarchyPageImpl implements HierarchyPage {

    /**
     * Resource type of associated with the current implementation
     */
    protected static final String RESOURCE_TYPE = "wknd-spa-react/components/page";

    /**
     * Request attribute key of the component context
     */
    private static final String COMPONENT_CONTEXT_ATTR = "com.day.cq.wcm.componentcontext";

    /**
     * Request attribute key of the current page
     */
    private static final String CURRENT_PAGE_ATTR = "currentPage";

    /**
     * Request attribute key of the request page entry point
     */
    private static final String HIERARCHY_ENTRY_POINT_PAGE_ATTR = "com.adobe.aem.guides.wknd.spa.react.core.models.impl.entryPointPage";

    /**
     * Flags the child pages. Optionally available as a request attribute
     */
    private static final String IS_CHILD_PAGE_ATTR = "com.adobe.aem.guides.wknd.spa.react.core.models.impl.isChildPage";

    /**
     * Is the current model to be considered as a model root
     */
    private static final String PR_IS_ROOT = "isRoot";

    /**
     * Depth of the tree of pages
     */
    private static final String STRUCTURE_DEPTH_PN = "structureDepth";

    /**
     * List of Regexp patterns to filter the exported tree of pages
     */
    private static final String STRUCTURE_PATTERNS_PN = "structurePatterns";

    /**
     * URL extension specific to the Sling Model exporter
     */
    private static final String URL_MODEL_EXTENSION = ".model.json";

    @Self
    private SlingHttpServletRequest request;

    @Inject
    private ModelFactory modelFactory;

    @Inject
    private PageManager pageManager;

    @ScriptVariable
    @JsonIgnore
    private Resource resource;

    @Inject
    private SlingModelFilter slingModelFilter;

    private Map<String, ? extends HierarchyPage> childPages = null;

    private Map<String, ComponentExporter> childModels = null;

    @ScriptVariable
    @JsonIgnore
    protected ResourceResolver resolver;

    @ScriptVariable
    protected com.day.cq.wcm.api.Page currentPage;

    @ScriptVariable
    protected Style currentStyle;

    @Nullable
    @Override
    public String getExportedHierarchyType() {
        return HierarchyTypes.PAGE;
    }

    @NotNull
    @Override
    public Map<String, ? extends HierarchyPage> getExportedChildren() {
        if (childPages == null) {
            childPages = getChildPageModels(request, HierarchyPage.class);
        }

        return childPages;
    }

    @NotNull
    @Override
    public Map<String, ? extends ComponentExporter> getExportedItems() {
        if (childModels == null) {
            childModels = getItemModels(request, ComponentExporter.class);
        }

        return childModels;
    }

    @NotNull
    @Override
    public String[] getExportedItemsOrder() {
        Map<String, ? extends ComponentExporter> models = getExportedItems();

        if (models.isEmpty()) {
            return ArrayUtils.EMPTY_STRING_ARRAY;
        }

        return models.keySet().toArray(ArrayUtils.EMPTY_STRING_ARRAY);
    }

    @NotNull
    @Override
    public String getExportedType() throws IllegalStateException {
        Resource contentResource = currentPage.getContentResource();

        if (contentResource == null) {
            throw new IllegalStateException("No page content found: " + currentPage.getPath());
        }

        return contentResource.getResourceType();
    }

    @NotNull
    private SlingHttpServletRequest getHierarchyServletRequest(@NotNull SlingHttpServletRequest request, @NotNull Page hierarchyPage) {
        SlingHttpServletRequest wrapper = new SlingHttpServletRequestWrapper(request);

        ComponentContext componentContext = (ComponentContext) request.getAttribute(COMPONENT_CONTEXT_ATTR);

        // When traversing child pages the currentPage must be updated
        wrapper.setAttribute(COMPONENT_CONTEXT_ATTR, new HierarchyComponentContextWrapper(componentContext, hierarchyPage));
        wrapper.setAttribute(CURRENT_PAGE_ATTR, hierarchyPage);

        return wrapper;
    }

    /**
     * Returns a map (resource name => Sling Model class) of the given resource children's Sling Models that can be adapted to {@link T}.
     *
     * @param slingRequest The current request.
     * @param modelClass  The Sling Model class to be adapted to.
     * @return Returns a map (resource name => Sling Model class) of the given resource children's Sling Models that can be adapted to {@link T}.
     */
    @NotNull
    private <T> Map<String, T> getItemModels(@NotNull SlingHttpServletRequest slingRequest,
                                             @NotNull Class<T> modelClass) {
        Map<String, T> itemWrappers = new LinkedHashMap<>();

        Iterable<Resource> iterable = slingModelFilter.filterChildResources(request.getResource().getChildren());

        if (iterable == null) {
            return itemWrappers;
        }

        for (final Resource child : iterable) {
            itemWrappers.put(child.getName(), modelFactory.getModelFromWrappedRequest(slingRequest, child, modelClass));
        }

        return  itemWrappers;
    }

    /**
     * Returns a flat list of all the child pages of a given page
     *
     * @param page                  - Page from which to extract child pages
     * @param slingRequest          - Request
     * @param structurePatterns     - Patterns to filter child pages
     * @param depth                 - Depth of the traversal
     * @return
     */
    @NotNull
    private List<Page> getChildPageRecursive(Page page, SlingHttpServletRequest slingRequest, List<Pattern> structurePatterns, int depth) {
        // By default the value is 0 meaning we do not expose child pages
        // If the value is set as a positive number it is going to be exposed until the counter is brought down to 0
        // If the value is set to a negative value all the child pages will be exposed (full traversal tree - aka infinity)
        // Child pages do not expose their respective child pages
        if (page == null || depth == 0 || Boolean.TRUE.equals(slingRequest.getAttribute(IS_CHILD_PAGE_ATTR))) {
            return Collections.emptyList();
        }

        List<Page> pages = new ArrayList<>();
        Iterator<Page> childPagesIterator = page.listChildren();

        if (childPagesIterator == null || !childPagesIterator.hasNext()) {
            return Collections.emptyList();
        }

        // we are about to explore one lower level down the tree
        depth--;

        boolean noPageFilters = structurePatterns.isEmpty();

        while (childPagesIterator.hasNext()) {
            Page childPage = childPagesIterator.next();
            boolean found = noPageFilters;

            for (Pattern pageFilterPattern : structurePatterns) {
                if (pageFilterPattern.matcher(childPage.getPath()).find()) {
                    found = true;
                    break;
                }
            }

            if (!found) {
                continue;
            }

            pages.add(childPage);

            pages.addAll(getChildPageRecursive(childPage, slingRequest, structurePatterns, depth));
        }

        return pages;
    }

    /**
     * Optionally add a child page that is the entry point of a site model request when this child is not added by the root structure configuration
     *
     * @param slingRequest  The current servlet request
     * @param childPages    List of child pages
     */
    private void addAsynchronousChildPage(@NotNull SlingHttpServletRequest slingRequest, @NotNull List<Page> childPages) {
        // Child pages are only added to the root page
        if (Boolean.TRUE.equals(slingRequest.getAttribute(IS_CHILD_PAGE_ATTR))) {
            return;
        }

        // Eventually add a child page that is not part page root children of the but is the entry point of the request
        Page entryPointPage = (Page) slingRequest.getAttribute(HIERARCHY_ENTRY_POINT_PAGE_ATTR);

        if (entryPointPage == null) {
            return;
        }

        // Filter the root page
        if (entryPointPage.getPath().equals(currentPage.getPath())) {
            return;
        }

        // Filter duplicates
        if (childPages.contains(entryPointPage)) {
            return;
        }

        childPages.add(entryPointPage);
    }

    @NotNull
    private <T> Map<String, T> getChildPageModels(@NotNull SlingHttpServletRequest slingRequest,
                                                  @NotNull Class<T> modelClass) {

        int pageTreeTraversalDepth = getPageTreeTraversalDepth();

        List<Pattern> pageFilterPatterns = getStructurePatterns(slingRequest);

        // Setting the child page to true to prevent child pages to expose their own child pages
        SlingHttpServletRequest slingRequestWrapper = new SlingHttpServletRequestWrapper(slingRequest);

        Map<String, T> itemWrappers = new LinkedHashMap<>();

        List<Page> childPages = getChildPageRecursive(currentPage, slingRequestWrapper, pageFilterPatterns, pageTreeTraversalDepth);

        addAsynchronousChildPage(slingRequest, childPages);

        // Add a flag to inform the model of the child pages that they are not the root of the tree
        slingRequestWrapper.setAttribute(IS_CHILD_PAGE_ATTR, true);

        for (Page childPage: childPages) {
            Resource childPageContentResource = childPage.getContentResource();

            if (childPageContentResource == null) {
                continue;
            }

            // Try to pass the templated content resource
            TemplatedResource templatedResource = childPageContentResource.adaptTo(TemplatedResource.class);

            if (templatedResource != null) {
                childPageContentResource = templatedResource;
            }

            // TODO: CQ-4245895 - [Content Service][Editable SPA] routing and export based on page URL - use URL instead of path
            itemWrappers.put(childPage.getPath(), modelFactory.getModelFromWrappedRequest(getHierarchyServletRequest(slingRequestWrapper, childPage), childPageContentResource, modelClass));
        }

        return itemWrappers;
    }

    /**
     * Returns the page structure patterns to filter the child pages to be exported.
     * The patterns can either be stored on the template policy of the page or provided as a request parameter
     *
     * @param slingRequest  - Request
     * @return
     */
    @NotNull
    private List<Pattern> getStructurePatterns(@NotNull SlingHttpServletRequest slingRequest) {
        RequestParameter pageFilterParameter = slingRequest.getRequestParameter(STRUCTURE_PATTERNS_PN.toLowerCase());

        String rawPageFilters = null;

        if (pageFilterParameter != null) {
            rawPageFilters = pageFilterParameter.getString();
        }

        if (currentStyle != null && StringUtils.isBlank(rawPageFilters)) {
            rawPageFilters = currentStyle.get(STRUCTURE_PATTERNS_PN, String.class);
        }

        if (StringUtils.isBlank(rawPageFilters)) {
            return Collections.emptyList();
        }

        String[] pageFilters = rawPageFilters.split(",");

        List<Pattern> pageFilterPatterns = new ArrayList<>();
        for (String pageFilter : pageFilters) {
            pageFilterPatterns.add(Pattern.compile(pageFilter));
        }

        return pageFilterPatterns;
    }

    /**
     * Returns the first numeric selector. The default value is 0
     *
     * @return
     */
    private int getPageTreeTraversalDepth() {
        Integer pageTreeTraversalDepth = null;

        if (currentStyle != null) {
            pageTreeTraversalDepth = currentStyle.get(STRUCTURE_DEPTH_PN, Integer.class);
        }

        if (pageTreeTraversalDepth == null) {
            return 0;
        }

        return pageTreeTraversalDepth;
    }

    @NotNull
    @Override
    public String getExportedPath() {
        return currentPage.getPath();
    }

    /**
     * TODO Replace with the core component Utils.getURL function
     *
     * https://git.corp.adobe.com/CQ/aem-core-wcm-components/blob/development/bundles/core/src/main/java/com/adobe/cq/wcm/core/components/internal/Utils.java#L60
     *
     * @param request
     * @param page
     * @return
     */
    private String getURL(@NotNull SlingHttpServletRequest request, @NotNull Page page) {
        String vanityURL = page.getVanityUrl();
        return StringUtils.isEmpty(vanityURL) ? request.getContextPath() + page.getPath() + ".html" : request.getContextPath() + vanityURL;
    }

    /**
     * Returns a model URL for the given page
     *
     * @param request
     * @param page
     * @return
     */
    private String getModelUrl(@NotNull SlingHttpServletRequest request, @NotNull Page page) {
        String url = getURL(request, page);

        if (StringUtils.isBlank(url)) {
            return null;
        }

        int dotIndex = url.indexOf(".");

        if (dotIndex < 0) {
            dotIndex = url.length();
        }

        return url.substring(0, dotIndex) + URL_MODEL_EXTENSION;
    }

    /**
     * @return Returns the root model of the given page
     */
    public HierarchyPage getRootModel() {
        if (currentStyle != null && currentStyle.containsKey(PR_IS_ROOT)) {
            return this;
        }

        Page rootPage = getRootPage();

        if (rootPage == null) {
            return null;
        }

        request.setAttribute(HIERARCHY_ENTRY_POINT_PAGE_ATTR, currentPage);

        return modelFactory.getModelFromWrappedRequest(getHierarchyServletRequest(request, rootPage), rootPage.getContentResource(), this.getClass());
    }

    /**
     * @return Returns the root (app) page the current page is part of
     */
    private Page getRootPage() {
        Page page = currentPage;
        boolean isRootModel = false;

        ContentPolicyManager contentPolicyManager = resource.getResourceResolver().adaptTo(ContentPolicyManager.class);

        do {
            page = page.getParent();

            if (page == null) {
                continue;
            }

            Template template = page.getTemplate();

            if (template == null || !template.hasStructureSupport()) {
                continue;
            }

            Resource pageContentResource = page.getContentResource();

            if (pageContentResource == null) {
                continue;
            }

            ContentPolicy pageContentPolicy = contentPolicyManager.getPolicy(pageContentResource);

            if (pageContentPolicy == null) {
                continue;
            }

            ValueMap properties = pageContentPolicy.getProperties();

            if (properties == null) {
                continue;
            }

            isRootModel = properties.containsKey(PR_IS_ROOT);

        } while(page != null && !isRootModel);

        return page;
    }

    @Nullable
    @Override
    public String getRootUrl() {
        if (currentStyle != null && currentStyle.containsKey(PR_IS_ROOT)) {
            return getModelUrl(request, currentPage);
        }

        Page page = getRootPage();

        if (page != null) {
            return getModelUrl(request, page);
        }

        return null;
    }

    @Nullable
    @Override
    public String getTitle() {
        if (!StringUtils.isBlank(currentPage.getNavigationTitle())) {
            return currentPage.getNavigationTitle();
        }

        if (!StringUtils.isBlank(currentPage.getTitle())) {
            return currentPage.getTitle();
        }

        return currentPage.getPageTitle();
    }

}
