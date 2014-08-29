; (function ($) { // $ = JQuery , 並使用即時函數
    // 建立 instances 物件來保存
    var instances = {};

    $.fn.extend({
        /* <HTML A> => 呼叫這裡的 Function*/
        tooltip: function (options) {
            // 組成所需 Option 
            options = $.extend({}, $.tooltip.defaults, {
            }, options);

            return this.each(function () {
                // 回傳 tooltip 物件 <HTML Aa>
                new $.tooltip(this, options);
            });
        }
    });

    $.tooltip = function (input, options) {
        /* <HTML B> => $.tooltip("tt") 傳進來只有一個變數 arguments.length === 1 所以走 if 敘述式 */
        if (arguments.length === 1 && typeof arguments[0] == "string") {
            // id 記錄起來
            var id = arguments[0];

            // 尋找 instances 裡的原型鏈有沒有這個id , 如果有就回傳已經記錄在 instances[id] 的物件, 沒有則提醒找不到此物件
            if (instances.hasOwnProperty(id)) {
                return instances[id];
            } else {
                alert("無此物件");
            }
        } else {
            /* <HTML Aa> => 因為$.tooltip(this, options)帶了兩個參數, arguments.length === 2 所以進入 else 敘述, 並初始化物件內容 */
            // 以下為 private
            // 先把自己的狀態存起來
            var self = input;
            var $self = $(input);
            var selfID = input.id;
            var beforeColor = $self.css("color");
            var beforeTextDecoration = $self.css("text-decoration");

            // 使用具名函數建立 TextAttribute 建構子來控制所有文字的屬性
            var TextAttribute = function TextAttribute(color, textdecoration){
                this.color = color;
                this.textdecoration = textdecoration.split(" ")[0];
            }

            // 建立 beforeAttribute 物件, 把修改文字前的屬性記錄下來
            var beforeAttribute = new TextAttribute(beforeColor, beforeTextDecoration);
            // 建立 AfterAttribute 物件, 把要修改文字的屬性記錄下來
            var AfterAttribute = new TextAttribute(options.color , options.textdecoration);

            // 滑鼠 Hover 事件
            $self.bind("mouseover", function(){

                // 變化文字顏色
                if (AfterAttribute.color){
                    $self.css("color" , AfterAttribute.color);
                };

                // 變換文字 decoration
                if (AfterAttribute.textdecoration){
                    $self.css("text-decoration" , AfterAttribute.textdecoration);
                };

                // 產生 tooltip Div
                var tooltipLeft = $self.offset().left;
                var selfHeight = $self.height();
                var tooltipTop = $self.offset().top - selfHeight - 15 < 0 ? 0 : $self.offset().top - selfHeight - 15;
                $("body").append("<div id=" + selfID + "_box class='tooltip' style='top:" + tooltipTop + "; left:" + tooltipLeft + ";'>" + options.text + "</div> " );

                // 綁定滑鼠放上去之後所要觸發的事件 <JS A>
                $self.trigger("beforeMouseover");
            });

            // 滑鼠 leave 事件
            $self.bind("mouseout", function(){
                // 把顏色和 text-decoration 恢復成之前顏色
                $self.css("color" , beforeAttribute.color);
                $self.css("text-decoration" , beforeAttribute.textdecoration);
                $("#" + selfID + "_box").remove();

                // <HTML D> => 綁定滑鼠離開之後所要觸發的事件
                $self.trigger("afterMouseout");
            });


            // 以下為 public 方法
            // <HTML C> => 提供一個 mouseoverEvent Method 來控制 mouseover 後要做的事 
            self.mouseoverEvent = function(callback){
                if (typeof callback === "function"){
                    // 連結 <JS A>
                    $self.bind("beforeMouseover", function(){ callback(); });
                }
            }

            // <HTML E> => 提供一個 changeColor Method
            self.changeColor = function(color){
                // 變化顏色
                $(self).css("color", color);
                // 記得 beforeAttribute 物件也要跟著紀錄
                beforeAttribute.color = color;
            }

        }
 
        // 最後更新一下 instances 
        instances[input.id] = self;
    };

    // 設定物件的初始設定
    $.tooltip.defaults = {
        color : "blue",
        textdecoration : "underline",
        text : ""
    };
})(jQuery); // 傳入 Jquery 物件
