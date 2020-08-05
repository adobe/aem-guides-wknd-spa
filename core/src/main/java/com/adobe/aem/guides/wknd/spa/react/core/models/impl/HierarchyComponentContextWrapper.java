package com.adobe.aem.guides.wknd.spa.react.core.models.impl;

import java.util.Set;

import org.apache.sling.api.resource.Resource;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.components.AnalyzeContext;
import com.day.cq.wcm.api.components.Component;
import com.day.cq.wcm.api.components.ComponentContext;
import com.day.cq.wcm.api.components.EditContext;
import com.day.cq.wcm.api.designer.Cell;

public class HierarchyComponentContextWrapper implements ComponentContext {

    private ComponentContext wrappedComponentContext;
    private Page hierarchyPage;

    HierarchyComponentContextWrapper(ComponentContext wrappedComponentContext, Page hierarchyPage) {
        this.wrappedComponentContext = wrappedComponentContext;
        this.hierarchyPage = hierarchyPage;
    }

    @Override
    public ComponentContext getParent() {
        return this.wrappedComponentContext.getParent();
    }

    @Override
    public ComponentContext getRoot() {
        return this.wrappedComponentContext.getRoot();
    }

    @Override
    public boolean isRoot() {
        return this.wrappedComponentContext.isRoot();
    }

    @Override
    public Resource getResource() {
        return this.wrappedComponentContext.getResource();
    }

    @Override
    public Cell getCell() {
        return this.wrappedComponentContext.getCell();
    }

    @Override
    public EditContext getEditContext() {
        return this.wrappedComponentContext.getEditContext();
    }

    @Override
    public AnalyzeContext getAnalyzeContext() {
        return this.wrappedComponentContext.getAnalyzeContext();
    }

    @Override
    public Component getComponent() {
        return this.wrappedComponentContext.getComponent();
    }

    @Override
    public Page getPage() {
        return hierarchyPage;
    }

    @Override
    public Object getAttribute(String s) {
        return this.wrappedComponentContext.getAttribute(s);
    }

    @Override
    public Object setAttribute(String s, Object o) {
        return this.wrappedComponentContext.setAttribute(s, o);
    }

    @Override
    public Set<String> getCssClassNames() {
        return this.wrappedComponentContext.getCssClassNames();
    }

    @Override
    public boolean hasDecoration() {
        return this.wrappedComponentContext.hasDecoration();
    }

    @Override
    public void setDecorate(boolean b) {
        this.wrappedComponentContext.setDecorate(b);
    }

    @Override
    public String getDecorationTagName() {
        return this.wrappedComponentContext.getDecorationTagName();
    }

    @Override
    public void setDecorationTagName(String s) {
        this.wrappedComponentContext.setDecorationTagName(s);
    }

    @Override
    public String getDefaultDecorationTagName() {
        return this.wrappedComponentContext.getDefaultDecorationTagName();
    }

    @Override
    public void setDefaultDecorationTagName(String s) {
        this.wrappedComponentContext.setDecorationTagName(s);
    }
}