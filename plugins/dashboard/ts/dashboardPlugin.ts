/**
 * @module Dashboard
 * @main Dashboard
 */
/// <reference path="dashboardHelpers.ts"/>
module Dashboard {
  
  export var templatePath = 'plugins/dashboard/html/';
  export var pluginName = 'dashboard';
  
  export var _module = angular.module(pluginName, []);

  _module.config(["$routeProvider", ($routeProvider) => {
    $routeProvider.
            when('/dashboard/add', {templateUrl: Dashboard.templatePath + 'addToDashboard.html'}).
            when('/dashboard/edit', {templateUrl: Dashboard.templatePath + 'editDashboards.html'}).
            when('/dashboard/idx/:dashboardIndex', {templateUrl: Dashboard.templatePath + 'dashboard.html', reloadOnSearch: false }).
            when('/dashboard/id/:dashboardId', {templateUrl: Dashboard.templatePath + 'dashboard.html', reloadOnSearch: false }).
            when('/dashboard/id/:dashboardId/share', {templateUrl: Dashboard.templatePath + 'share.html'}).
            when('/dashboard/import', {templateUrl: Dashboard.templatePath + 'import.html'});
  }]);

  _module.value('ui.config', {
    // The ui-jq directive namespace
    jq: {
      gridster: {
        widget_margins: [10, 10],
        widget_base_dimensions: [140, 140]
      }
    }
  });

  var tab = undefined;

  export function setSubTabs(builder, dashboards:Array<Dashboard>, $rootScope) {
    tab.tabs = [];
    _.forEach(dashboards, (dashboard) => {
      var child = builder
        .id('dashboard-' + dashboard.id)
        .title(() => dashboard.title || dashboard.id)
        .href(() => {
          var uri = new URI(UrlHelpers.join('/dashboard/id', dashboard.id))
            uri.search({
              'main-tab': pluginName,
              'sub-tab': 'dashboard-' + dashboard.id
            });
          return uri.toString();
        })
      .build();
      tab.tabs.push(child);
    });
    var manage = builder
      .id('dashboard-manage')
      .title(() => '<i class="fa fa-pencil"></i>&nbsp;Manage')
      .href(() => '/dashboard/edit?main-tab=dashboard&sub-tab=dashboard-manage')
      .build();
    tab.tabs.push(manage);
    Core.$apply($rootScope);
  }

  _module.run(["HawtioNav", "dashboardRepository", "$rootScope", (nav:HawtioMainNav.Registry, dashboards:DashboardRepository, $rootScope) => {
    var builder = nav.builder();
    tab = builder.id(pluginName)
                .href(() => '/dashboard/idx/0')
                .title(() => 'Dashboard')
                .build();
    nav.add(tab);
    dashboards.getDashboards((dashboards) => {
      setSubTabs(builder, dashboards, $rootScope);
    });
  }]);

  hawtioPluginLoader.addModule(pluginName);
}