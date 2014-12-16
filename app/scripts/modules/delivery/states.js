'use strict';

angular.module('deckApp.delivery')
  .constant('deliveryStates', {
    executions: {
      name: 'executions',
      url: '/executions',
      views: {
        'insight': {
          templateUrl: 'scripts/modules/delivery/pipelineExecutions.html',
          controller: 'pipelineExecutions as ctrl',
        },
      },
      children: [
        {
          name: 'execution',
          url: '/:executionId',
          view: {},
          data: {
            pageTitleDetails: {
              title: 'Execution Details',
              nameParam: 'executionId'
            }
          }
        },
      ],
      data: {
        pageTitleSection: {
          title: 'Pipeline Executions'
        }
      }
    },
    configure: {
      name: 'pipelineConfig',
      url: '/pipelines',
      views: {
        'insight': {
          templateUrl: 'scripts/modules/pipelines/config/pipelineConfig.html',
          controller: 'PipelineConfigCtrl as pipelineConfigCtrl'
        },
      },
      data: {
        pageTitleSection: {
          title: 'pipeline config'
        }
      }
    }
  });