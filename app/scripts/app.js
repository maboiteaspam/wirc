'use strict';

/**
 * @ngdoc overview
 * @name wircApp
 * @description
 * # wircApp
 *
 * Main module of the application.
 */
angular
    .module('wircApp', [
        'duScroll',
        'wirc',
        'uiHelpers',
        'angularMoment',
        'angular-underscore'
    ])
    .run(function($rootScope){
        $rootScope.$on('userLogin', function(ev, user, w){
            $rootScope.$on('newMessage', function(ev, userMessage, user, w){
                /* broadcasts to other users via central server */
                w.sendMessage(
                    userMessage.userName,
                    userMessage.text,
                    userMessage.id,
                    userMessage.messageDate,
                    user.token);
            });
            $rootScope.$on('userLogout', function(ev, user, w){
                /* disconnects from the socket */
                if(w){
                    w.quit(user.userName, user.token);
                }
            });
        });
    })
    /*
     */
;
