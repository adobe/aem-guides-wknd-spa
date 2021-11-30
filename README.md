# AEM Guides - WKND SPA Project

This is the code companion for a series of tutorials designed for developers new to the **SPA Editor** feature in Adobe Experience Manager (AEM). There are two parallel versions of the tutorial:

* [Create your first Angular SPA in AEM](https://experienceleague.adobe.com/docs/experience-manager-learn_en/getting-started-with-aem-headless/spa-editor/angular/overview.html)
* [Create your first React SPA in AEM](https://experienceleague.adobe.com/docs/experience-manager-learn/getting-started-with-aem-headless/spa-editor/react/overview.html)

The starter and solution branches in this repository correspond to **Angular** and **React** versions of the tutorial.

## Modules

The main parts of the project are:

* **core**: Java bundle containing all core functionality like OSGi services, listeners or schedulers, as well as component-related Java code such as servlets or request filters.
* **ui.apps**: contains the /apps (and /etc) parts of the project, ie JS&CSS clientlibs, components, templates and runmode specific configs
* **ui.content**: contains sample content using the components from the ui.apps
* **ui.tests**: Java bundle containing JUnit tests that are executed server-side. This bundle is not to be deployed onto production.
* **ui.frontend**: an optional dedicated front-end build mechanism. Depending on the branch this will be either the **React** or **Angular** source code.

## How to build

To build all the modules run in the project root directory the following command with Maven 3:

    mvn clean install

If you have a running AEM instance you can build and package the whole project and deploy into AEM with

    mvn clean install -PautoInstallSinglePackage

Or to deploy it to a publish instance, run

    mvn clean install -PautoInstallSinglePackagePublish

### Building for AEM 6.x.x

The project has been designed for **AEM as a Cloud Service**. The project is also backward compatible with AEM **6.4.8** by adding the `classic` profile when executing a build, i.e:

    mvn clean install -PautoInstallSinglePackage -Pclassic
