(function(){
    'use strict';
    var module = angular.module('app', ['onsen']);

    module.controller('AppController', function($scope) {

    });

    module.controller("HomeController", function(){

    });

    module.controller('EntryController', function($scope, selectList, DataSendService) {

        $scope.mhm_title = "";
        $scope.mhm_comment = "";
        $scope.image_url = "";

        var _args = myNavigator.getCurrentPage().options;


        //picture 選択
        $scope.showPictureSelect = function(){

            navigator.camera.getPicture(
                function(image_url){
                    $scope.image_url = image_url;
                },
                function(){
                    console.log("error");
                },
                {
                    quality: 50,
                    destinationType: Camera.DestinationType.FILE_URI,
                    sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM
                }
            );
        };

        //登録ボタン
        $scope.entryRecord = function(){
            
            var text_info = {

            };

            DataSendService.sendData(text_info, $scope.image_url)
                .then(function(){
                    alert("all process complete!!");
                })
                .catch(function(e){
                    alert("process failure...");
                    console.log(e);
                });
        }

        // リスト選択イベント受け取り
        $scope.$on("listSelected", function(e, param){
            switch(param.parent_option.title){
                case "flavor_group":
                    $scope.sf_selected_flavor_group = param.item.value;
                    break;
                default:
                    console.log("return value missing...");
            }
        });
    });

    //汎用 選択リスト画面
    module.controller("SelectListController", function($scope, $rootScope, selectList){

        $scope.items = selectList.items;

        $scope.processItemSelect = function(index){
            var nav_options = myNavigator.getCurrentPage().options;
            var selectedItem = selectList.items[index];
            selectList.selectedItem = selectedItem;
            myNavigator.popPage();

            // イベント通知
            $rootScope.$broadcast("listSelected", {parent_option: nav_options, item: selectedItem});
        }
    });

    // 
    module.service("DataSendService", function($http){
        this.sendData = function(text_info, image_url){
            var host = "http://tasokori.net/";
            return this.sendTextData(host, text_info)
                .then(function(){
                    return this.sendImgData(
                        host,
                        image_url
                    );
                });
        };
        this.sendTextData = function(host, text_info){
            return $http.post(host, text_info)
                // 戻りはpromiseオブジェクトなんで
                .then(function(response_wrapper){
                    return response_wrapper.return_cd;
                });
        };
        this.sendImgData = function(host, image_url){
            return new Promise(function(resolve, reject){
                var options = new FileUploadoptions();
                options["fileName"] = "mytestjpegimg.jpg";

                var ft = new FileTransfer();
                ft.upload(
                    image_url, 
                    encodeURI(host), 
                    resolve,
                    reject,
                    options
                );
            });
        };
    });

    module.service("selectList", function(){
        this.items = [];
        this.selectedItem = {};
        this.addItem = function(_key, _value){
            this.items.push({
                key: _key,
                value: _value
            });
        };
        this.removeItem = function(idx){
            this.items.splice(idx, 1);
        };
        this.removeAllItems = function(){
            this.items.length = 0;
        };
        this.createItemsFromObjectArr = function(objArr, key_name, value_name){
            for(var i = 0; i < objArr.length; i++){
                this.addItem(objArr[i][key_name], objArr[i][value_name]);
            }
        };
        this.createItemsFromArr = function(arr){
            for(var i = 0; i < arr.length; i++){
                this.addItem("" + i, arr[i]);
            }
        };

    });

})();