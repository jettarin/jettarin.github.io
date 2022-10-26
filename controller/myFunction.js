angular.module('services.myFunction', [])

    .service('myFunction', ['$rootScope', '$route', '$translate', '$modal', '$http','$location', function ($rootScope, $route, $translate, $modal, $http,$location) {

        //######################################## [START] SWITCH LANGUAGE ########################################
        this.initLang = function () {
//		$rootScope.app.currentLang = $translate.use();
        };

        this.switchLang = function (langKey) {
//		if (langKey != $translate.use()) {
//			$rootScope.app.currentLang = langKey;
//			$translate.use(langKey);
//			$route.reload();
//		}
            // $http.get(_.toHttpGetUrl(APP.CONTEXT_PATH + '/api/user/switchLang/' + langKey)).success(function (resp) {
            //     location.reload();
            // });
        };
        //######################################## [ END ] SWITCH LANGUAGE ########################################

        //######################################## [START] ALERT MESSAGE #############################################
        this.alert = function (type, msg, isCovertTxt) {
            var title = "";
            if (type == "gritter-info")
                title = "Information";
            else if (type == "gritter-success")
                title = "Success";
            else if (type == "gritter-warning")
                title = "Warning!";
            else if (type == "gritter-error")
                title = "Error!";

            var message = '';
            if (angular.isString(msg)) {
                if (isCovertTxt) {
                    message = $translate.instant(msg);
                    if (!message) {
                        message = msg;
                    }
                } else {
                    message = msg;
                }
            } else if (angular.isObject(msg)) {
//			message = msg.errCode + " : " + msg['message'+$translate.use()];
                message = msg.errCode + " : " + msg.message;
            }

            // $.gritter.add({
            //     title: $translate.instant(title),
            //     text: message,
            //     class_name: type
            // });
            return false;
        };

        this.success = function() {
            console.log('success');
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Your work has been saved',
                showConfirmButton: false,
                timer: 1500
              })
        };

        this.alertRequiredFields = function () {
            this.alert('gritter-error', 'Please fill in all required fields!', true);
        };

        this.alertRequiredSelectOneItem = function () {
            this.alert('gritter-error', 'You should select at least one item before selecting!', true);
        };

        this.alertCreateSuccess = function () {
            this.alert('gritter-success', 'Create data successful.', true);
        };

        this.alertUpdateSuccess = function () {
            this.alert('gritter-success', 'Update data successful.', true);
        };

        this.alertDeleteSuccess = function () {
            this.alert('gritter-success', 'Delete data successful.', true);
        };
        this.alertRejectSuccess = function () {
            this.alert('gritter-success', 'Reject data successful.', true);
        };

        //######################################## [ END ] ALERT MESSAGE #############################################

        //######################################## [START] CONFIRM DIALOG BOX ########################################
        var ModalInstanceCtrl = function ($scope, $modalInstance, model) {
            $scope.title = model.title;
            $scope.message = model.message;
            $scope.buttons = model.buttons;

            $scope.close = function (res) {
                $modalInstance.close(res);
            };
        };

        var ModalInstanceSetHuourCtrl = function ($scope, $modalInstance, model) {
            $scope.title = model.title;
            $scope.message = model.message;
            $scope.buttons = model.buttons;
            $scope.setHr = function (val){
              $rootScope.criteria.hour = val
              let result = true;
              $scope.close(result)
            }

            $scope.close = function (res) {
                $modalInstance.close(res);
            };
        };

        this.confirmBox = function (msg, negativeBtn, positiveBtn) {
            msg = $translate.instant(msg);
            negativeBtn = $translate.instant(negativeBtn);
            positiveBtn = $translate.instant(positiveBtn);
            return $modal.open({
                templateUrl: APP.CONTEXT_PATH + '/template/modal/confirm.html?v=' + APP.VERSION
                , backdrop: 'static'
                , keyboard: false
                , controller: ModalInstanceCtrl
                , resolve: {
                    model: function () {
                        return {
                            title: null,
                            message: msg,
                            buttons: [{result: true, label: positiveBtn, cssClass: "btn-primary"}
                                , {result: false, label: negativeBtn, cssClass: "btn-warning"}]
                        };
                    }
                }
            });
        };

        this.dialogBox = function (msg, negativeBtn, positiveBtn) {
            msg = $translate.instant(msg);
            negativeBtn = $translate.instant(negativeBtn);
            positiveBtn = $translate.instant(positiveBtn);
            return $modal.open({
                templateUrl: APP.CONTEXT_PATH + '/template/modal/dialog.html?v=' + APP.VERSION
                , backdrop: 'static'
                , keyboard: false
                , controller: ModalInstanceSetHuourCtrl
                , resolve: {
                    model: function () {
                        return {
                            title: null,
                            message: msg,
                            buttons: [
                              // {result: true, label: positiveBtn, cssClass: "btn-primary"},
                              {result: false, label: negativeBtn, cssClass: "btn-warning"}
                            ]
                        };
                    }
                }
            });
        };


        this.confirmSaveBox = function () {
            return this.confirmBox("ต้องการบันทึกหรือไม่ ?", "ยกเลิก", "ตกลง");
        };

        this.confirmEditBox = function () {
            return this.confirmBox("ต้องการแก้ไขหรือไม่ ?", "Cancel", "Yes");
        };
        this.confirmDeleteBox = function (){
          return this.confirmBox("ต้องการลบหรือไม่ ?", "ยกเลิก", "ตกลง");
        }
        this.confirmDeleteWorkBox = function (v){
          return this.confirmBox("ต้องการลบ "+v+" หรือไม่ ?", "ยกเลิก", "ตกลง");
        }
        this.confirmAsignBox = function (p,n,l) {
          return this.confirmBox("ต้องการมอบหมายสิทธ์หัวหน้าให้ "+p+n+"  "+l+" ?", "ยกเลิก", "ตกลง");
        };
        this.confirmCancelAsignBox = function (p,n,l) {
          return this.confirmBox("ต้องการยกเลิกมอบหมายสิทธ์หัวหน้าให้ "+p+n+"  "+l+" ?", "ยกเลิก", "ตกลง");
        };
        this.confirmRedeemBox = function (message){
          return this.confirmBox("คุณต้องการร้องขอการแลกเวร "+message+" กับเวรอื่นหรือไม่ ?", "ยกเลิก", "ตกลง");
        }
        this.confirmTradeBox = function (name1,name2){
          return this.confirmBox("ต้องการดำเนินงานแลกเวร หรือไม่ ?", "ยกเลิก", "ตกลง");
        }
        this.confirmLeaveBox = function (d){
          return this.confirmBox("ท่านต้องการลาวัน "+d+" หรือไม่ ?", "ยกเลิก", "ตกลง");
        }
        this.confirmClearDataBox = function (){
            return this.confirmBox("ข้อมูลที่ท่านเลือกข้อมูลที่ท่านเลือกจะถูกยกเลิก", "ปิด", "ตกลง");
        }
        this.confirmSwalSaveBox = function (){
           return Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to Save this!",
                icon: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, do it!'
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire(
                    'Saved !',
                    'Your Data has been Saved.',
                    'success'
                  )
                  return true;
                }else{
                    
                    
                }
              })
        }

        this.confirmSwalDeleteBox = function (){
            return Swal.fire({
                 title: 'Are you sure?',
                 text: "You won't be able to Delete this!",
                 icon: 'warning',
                 showCancelButton: true,
                 confirmButtonColor: '#3085d6',
                 cancelButtonColor: '#d33',
                 confirmButtonText: 'Yes, do it!'
               }).then((result) => {
                 if (result.isConfirmed) {
                   Swal.fire(
                     'Deleted !',
                     'Your Data has been Deleted.',
                     'success'
                   )
                   return true;
                 }else{
                     return false;
                 }
               })
         }




        this.onBehalfOfBox = function (msg, negativeBtn, positiveBtn) {
            return $modal.open({
                templateUrl: APP.CONTEXT_PATH + '/module/common/popup-on-behalf-of.jsp?v=' + APP.VERSION,
                controller: PopupOnBehalfOfCtrl,
                windowClass: 'large',
                backdrop: 'static',
                keyboard: false
            });
        };
        //######################################## [ END ] CONFIRM DIALOG BOX ########################################


        this.dialogHurBox = function () {
            return this.dialogBox("Are you sure you want to save?", "Cancel", "Yes");
        };

    }]);
