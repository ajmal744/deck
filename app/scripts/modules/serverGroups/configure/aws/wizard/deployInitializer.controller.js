'use strict';

angular.module('deckApp.serverGroup.configure.aws.deployInitialization.controller', [
  'deckApp.serverGroup.read.service',
  'deckApp.utils.lodash',
  'deckApp.aws.serverGroupCommandBuilder.service',
])
  .controller('DeployInitializerCtrl', function($scope, awsServerGroupCommandBuilder, serverGroupReader, _) {
    var controller = this;

    var noTemplate = { label: 'None', serverGroup: null, cluster: null };

    $scope.command.viewState.template = noTemplate;

    $scope.templates = [ noTemplate ];

    var allClusters = _.groupBy($scope.application.serverGroups, function(serverGroup) {
      return [serverGroup.cluster, serverGroup.account, serverGroup.region].join(':');
    });

    _.forEach(allClusters, function(cluster) {
      var latest = _.sortBy(cluster, 'name').pop();
      $scope.templates.push({
        cluster: latest.cluster,
        account: latest.account,
        region: latest.region,
        serverGroupName: latest.name,
        serverGroup: latest
      });
    });

    function applyCommandToScope(command) {
      command.viewState.disableImageSelection = true;
      command.viewState.imageId = null;
      command.viewState.submitButtonLabel = 'Add';
      angular.copy(command, $scope.command);
    }

    function buildEmptyCommand() {
      return awsServerGroupCommandBuilder.buildNewServerGroupCommand($scope.application, {mode: 'createPipeline'}).then(function(command) {
        applyCommandToScope(command);
      });
    }

    function buildCommandFromTemplate(serverGroup) {
      return serverGroupReader.getServerGroup($scope.application.name, serverGroup.account, serverGroup.region, serverGroup.name).then(function (details) {
        angular.extend(details, serverGroup);
        return awsServerGroupCommandBuilder.buildServerGroupCommandFromExisting($scope.application, details, 'editPipeline').then(function (command) {
          applyCommandToScope(command);
        });
      });
    }

    controller.selectTemplate = function () {
      var selection = $scope.command.viewState.template;
      if (selection && selection.cluster && selection.serverGroup) {
        return buildCommandFromTemplate(selection.serverGroup);
      } else {
        return buildEmptyCommand();
      }
    };

    controller.useTemplate = function() {
      $scope.state.loaded = false;
      controller.selectTemplate().then(function() {
        $scope.$emit('template-selected');
      });
    };
  });