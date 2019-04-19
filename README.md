Bryan Test Page
=========
* javascript Sample for me
* 應該不能再用 instances 做元件的存取的地方，應該儲存在 Dom 元素 Data 內。
* bryanchengforeverloveleiweiweyandmujiou9/u7d6+9





"use strict";
var TimeController = function (options) {


    /*************************************************************
     * private 變數
     *************************************************************/
    var _defaultOptions = {
        apiServerTimeout : 2000,
        startHour : 23,
        startMin : 30,
        endHour : 1,
        endMin : 0
    }

    var _this = this
    var _nowCurrentDateTime = null;
    var _options = $.extend({}, _defaultOptions, {}, options);

    /*************************************************************
     * private 函式
     *************************************************************/
    
    /**
    * 取得 server time 
    * 
    * @returns {Promise Object}
    * 
    */ 
    var _getServerTimePromise = function(){
        var $dfd = $.Deferred();
        $.ajax({
            url: 'http://worldclockapi.com/api/json/est/now',
            type : 'GET',
            timeout: _options.apiServerTimeout  
        }).done(function(data){
            $dfd.resolve(data);
        }).fail(function(){
            $dfd.reject();
        });

        return $dfd.promise();
    }

    /**
     * 是否在規定時間內判斷函式
     * 
     * @param {Object} res 
     * @param {Boolean} isApiSuccess 
     * 
     * @returns {Boolean} 是否在設定時間內
     * 
     */
    var inTimeCheck = function(res, isApiSuccess){
        isApiSuccess ? _nowCurrentDateTime = new Date(res.currentDateTime) :  _nowCurrentDateTime = new Date();
        var startTimeFormat = (parseInt(_options.startHour) * 100 + parseInt(_options.startMin));
        var endTimeFormat = (parseInt(_options.endHour) * 100 + parseInt(_options.endMin));
        var nowTimeFormat = (parseInt(_nowCurrentDateTime.getHours()) * 100 + parseInt(_nowCurrentDateTime.getMinutes()));
        var isCrossDate = startTimeFormat > endTimeFormat ? true : false;

        switch (isCrossDate) {
            case true:
                if ((startTimeFormat < nowTimeFormat ) || (nowTimeFormat < endTimeFormat)) {
                    return true;
                } else {
                    return false;
                }
            break;
            case false: 
                if ((startTimeFormat < nowTimeFormat ) && (nowTimeFormat < endTimeFormat)) {
                    return true;
                } else {
                    return false;
                }
            break;
        }
    }

    /**
     * callback Function 控制
     * 
     * @param {Boolean} isInTime 
     * @param {Function} inTimeCallback 
     * @param {Function} outTimeCallback 
     * 
     */
    var doCallbackFunc = function(isInTime, inTimeCallback, outTimeCallback) {
        if (isInTime) {
            if (typeof(inTimeCallback) === 'function') {
                inTimeCallback();
            }
        } else {
            if (typeof(outTimeCallback) === 'function') {
                outTimeCallback();
            }
        }
    }

    /**
     * 元件是否可以正常使用，應放入參數檢查 (非必要)
     * 
     */
    var compontCkeck = function(){}

    /*************************************************************
     * public 函式
     *************************************************************/

    /**
     * 執行
     * 
     * @param {Function} inTimeCallback
     * @param {Function} outTimeCallback
     * 
     */
    _this.run = function(inTimeCallback, outTimeCallback){
        var isInTime;
        _getServerTimePromise().done(function(res){
            isInTime = inTimeCheck(res, true); 
        }).fail(function(){
            isInTime = inTimeCheck(false);
        }).always(function(){
            doCallbackFunc(isInTime, inTimeCallback, outTimeCallback);
        });
    }
}
