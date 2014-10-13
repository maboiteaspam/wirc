'use strict';
/*global $:false */

angular.module('videoCapture', [
])
    /* Helper to represent and share status of the webcam feed */
    .service('webCamFeed', function () {
        return {
            is_open: false,
            picture: null
        };
    })
    /* Capture content of the webcam */
    .directive('captureWebcam', ['webCamFeed','$interval',function (webCamFeed, $interval) {
        return {
            restrict: 'A',

            link: function (scope, element, attrs) {
                var el = angular.element(element);
                /* add video and canvas el on the document */
                var d = $('<div></div>').appendTo(element);
                angular.element('<video></video>').appendTo(d);
                angular.element('<canvas></canvas>').appendTo(d);

                var timer;
                var video = el.find("video").get()[0];
                var canvas = el.find("canvas").get()[0];
                var ctx = canvas.getContext('2d');

                var unbindWatcher1 = scope.$watch(function(){
                    return webCamFeed.is_open;
                },function(newValue){
                    if( newValue ){
                        navigator.webkitGetUserMedia({
                                video: true,
                                audio: !true
                            },
                            function(stream) {
                                video.src = webkitURL.createObjectURL(stream);
                                var copy_p = function(){
                                    ctx.drawImage(video, 0, 0, 320, 240);
                                    var data = canvas.toDataURL('image/jpeg', 1.0);
                                    webCamFeed.picture = dataURItoBlob(data);
                                };
                                timer = $interval(copy_p, 40,null,false);
                                var unbindWatcher = scope.$watch(function(){
                                    return webCamFeed.is_open;
                                },function(newValue){
                                    if( ! newValue ){
                                        $interval.cancel( timer );
                                        stream.stop();
                                        unbindWatcher();
                                    }
                                });
                            },
                            function(err) {
                                console.log("Unable to get video stream!")
                            }
                        );
                    }
                });

                scope.$on("$destroy",function( event ) {
                    $interval.cancel( timer );
                    unbindWatcher1();
                });

                function dataURItoBlob(dataURI) {
                    // convert base64/URLEncoded data component to raw binary data held in a string
                    var byteString;
                    if (dataURI.split(',')[0].indexOf('base64') >= 0)
                        byteString = atob(dataURI.split(',')[1]);
                    else
                        byteString = unescape(dataURI.split(',')[1]);

                    // separate out the mime component
                    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

                    // write the bytes of the string to a typed array
                    var ia = new Uint8Array(byteString.length);
                    for (var i = 0; i < byteString.length; i++) {
                        ia[i] = byteString.charCodeAt(i);
                    }

                    return new Blob([ia], {type:mimeString});
                }
            }
        };
    }])
;