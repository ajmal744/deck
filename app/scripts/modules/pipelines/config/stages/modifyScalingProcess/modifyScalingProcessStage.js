'use strict';

angular.module('deckApp.pipelines.stage.modifyScalingProcess')
  .config(function(pipelineConfigProvider) {
    pipelineConfigProvider.registerStage({
      label: 'Modify Scaling Process',
      description: 'Suspend/Resume Scaling Processes',
      key: 'modifyScalingProcess',
      controller: 'ModifyScalingProcessStageCtrl',
      controlelrAs: 'modifyScalingProcessStageCtrl',
      templateUrl: 'scripts/modules/pipelines/config/stages/modifyScalingProcess/modifyScalingProcessStage.html',
      executionDetailsUrl: 'scripts/modules/pipelines/config/stages/modifyScalingProcess/modifyScalingProcessExecutionDetails.html',
    });
  }).controller('ModifyScalingProcessStageCtrl', function($scope, stage, accountService) {
    $scope.stage = stage;

    $scope.state = {
      accounts: false,
      regionsLoaded: false
    };

    accountService.listAccounts().then(function (accounts) {
      $scope.accounts = accounts;
      $scope.state.accounts = true;
    });

    $scope.regions = ['us-east-1', 'us-west-1', 'eu-west-1', 'us-west-2'];

    $scope.accountUpdated = function() {
      accountService.getRegionsForAccount($scope.stage.credentials).then(function(regions) {
        $scope.regions = _.map(regions, function(v) { return v.name; });
        $scope.regionsLoaded = true;
      });
    };

    $scope.toggleRegion = function(region) {
      if (!$scope.stage.regions) {
        $scope.stage.regions = [];
      }
      var idx = $scope.stage.regions.indexOf(region);
      if (idx > -1) {
        $scope.stage.regions.splice(idx,1);
      } else {
        $scope.stage.regions.push(region);
      }
    };

    $scope.targets = [
      {
        label: 'Last ASG',
        val: 'ancestor_asg'
      },
      {
        label: 'Current ASG',
        val: 'current_asg'
      }
    ];

    $scope.actions = [
      {
        label: 'Suspend',
        val: 'suspend'
      },
      {
        label: 'Resume',
        val: 'resume'
      }
    ];
    $scope.processes = [
      'Launch', 'Terminate', 'AddToLoadBalancer', 'AlarmNotification', 'AZRebalance', 'HealthCheck', 'ReplaceUnhealthy', 'ScheduledActions'
    ];

    (function() {
      if (!$scope.stage.processes) {
        $scope.stage.processes = [];
      }
      if ($scope.stage.credentials) {
        $scope.accountUpdated();
      }
      if ($scope.stage.action) {
        $scope.stage.action = _.groupBy($scope.action, 'val')[$scope.stage.action][0];
      } else {
        $scope.action = $scope.actions[0];
        $scope.stage.action = $scope.action.val;
      }
      if ($scope.stage.target) {
        $scope.stage.target = _.groupBy($scope.targets, 'val')[$scope.stage.target][0];
      } else {
        $scope.target = $scope.targets[0];
        $scope.stage.target = $scope.target.val;
      }
    })();
  
    $scope.toggleProcess = function(process) {
      if (!$scope.stage.processes) {
        $scope.stage.processes = [];
      }
      var idx = $scope.stage.processes.indexOf(process);
      if (idx > -1) {
        $scope.stage.processes.splice(idx,1);
      } else {
        $scope.stage.processes.push(process);
      }
    };

    $scope.updateTarget = function(type) {
      $scope.target = type;
      $scope.stage.target = type.val;
    };

    $scope.updateAction = function(type) {
      $scope.action = type;
      $scope.stage.action = type.val;
    };



    $scope.$watch('stage.credentials', $scope.accountUpdated);
  });
