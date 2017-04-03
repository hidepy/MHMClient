(function(){
    'use strict';
    var module = angular.module('app', ['onsen','checklist-model']);
    var storage_manager = new StorageManager("SOFTCREAM_COLLECTION_LIST");


    module.controller('AppController', function($scope, $data) {
        $scope.doSomething = function() {
            setTimeout(function() {
                alert('tappaed');
            }, 100);
        };
    });

    module.controller("HomeController", function(){

    });


    module.controller('EntryController', function($scope, selectList) {

        $scope.image_url = "";

        var _args = myNavigator.getCurrentPage().options;


        //写真選択
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
            
            
        }

        // リスト選択イベント受け取り
        $scope.$on("listSelected", function(e, param){

            //$scope.selected_bike = item.value;

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