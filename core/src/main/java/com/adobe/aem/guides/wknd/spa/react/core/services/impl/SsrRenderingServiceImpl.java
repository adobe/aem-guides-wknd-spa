/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2018 Adobe Systems Incorporated
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
package com.adobe.aem.guides.wknd.spa.react.core.services.impl;

import java.io.IOException;

import org.json.JSONException;
import org.json.JSONObject;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;

import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.osgi.services.HttpClientBuilderFactory;
import org.apache.http.util.EntityUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.factory.ModelFactory;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.metatype.annotations.Designate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.aem.guides.wknd.spa.react.core.models.HierarchyPage;
import com.adobe.aem.guides.wknd.spa.react.core.services.SsrRenderingService;
import com.adobe.aem.spa.project.core.models.Page;
import com.day.cq.wcm.api.WCMMode;
import com.drew.lang.annotations.NotNull;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component(service = { Servlet.class }, property = { "sling.servlet.resourceTypes=wknd/spa/ssr",
        "sling.servlet.methods=GET" })
@Designate(ocd = SsrRenderingService.Configuration.class)
/**
* Service responsible for fetching Server-Side pre-rendered HTML content
*/
public class SsrRenderingServiceImpl extends SlingSafeMethodsServlet implements SsrRenderingService {

  /**
   *
   */
  private static final long serialVersionUID = 1L;

  private static final Logger log = LoggerFactory.getLogger(SsrRenderingServiceImpl.class);

    @Reference
    private HttpClientBuilderFactory clientBuilderFactory;

    @Reference
    protected ModelFactory modelFactory;

    private String HOST;
    private boolean SSRENABLED;

    @Activate
    protected void activate(Configuration configuration) {
        HOST = configuration.spa_ssr_react_server();
        SSRENABLED = configuration.ssr_enabled();
    }

    @Override
    protected void doGet(@NotNull SlingHttpServletRequest request, @NotNull SlingHttpServletResponse response)
            throws ServletException, IOException {
        processSPARequest(request, response);
    }

    @Override
    public void processSPARequest(SlingHttpServletRequest request, SlingHttpServletResponse response)
        throws IOException {
      try {
        if(SSRENABLED) {
          CloseableHttpClient client = clientBuilderFactory.newBuilder().build();

          ObjectMapper mapper = new ObjectMapper();
          HierarchyPage rootPage = getRootModel(request);
          String pagePath = request.getPathInfo();
          JSONObject body = new JSONObject();
          JSONObject pageData = new JSONObject(mapper.writeValueAsString(rootPage));
          body.put("wcmmode", WCMMode.fromRequest(request).toString());
          body.put("pageRoot", rootPage.getExportedPath());
          body.put("pagePath", pagePath);
          body.put("data", pageData);

          HttpPost postMethod = new HttpPost(HOST);
          postMethod.setEntity(new StringEntity(body.toString(), ContentType.APPLICATION_JSON));

          CloseableHttpResponse preRenderedResponse = client.execute(postMethod);

          String responseBody = EntityUtils.toString(preRenderedResponse.getEntity());

          int statusCode = preRenderedResponse.getStatusLine().getStatusCode();

          if (statusCode >= 400) {
            throw new IOException(
                "Rendering App server-side finished with error code: " + statusCode + " and message: " + responseBody);
          }

          response.getWriter().write(responseBody);
        }
      } catch (IOException | NullPointerException | JSONException e) {
        // TODO: different problems may result in different error handling and codes
        log.error("Error while trying to Render App server-side: " + e.getMessage(), e);
        response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.toString());
      }
    }

    /**
    * Returns the page converted into a JSON string
    *
    * @param request
    * @return
    * @throws JsonProcessingException
    */
    private HierarchyPage getRootModel(SlingHttpServletRequest request) throws JsonProcessingException {
      HierarchyPage page = request.adaptTo(HierarchyPage.class);

      if (page == null) {
          return null;
      }


      return  page.getRootModel();
  }
}
 