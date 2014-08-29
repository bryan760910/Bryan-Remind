; (function ($) {
    var instances = {};

    $.fn.extend({
        tooltip: function (options) {
            options = $.extend({}, $.tooltip.defaults, {
            }, options);

            return this.each(function () {
                new $.tooltip(this, options);
            });
        }
    });

    $.tooltip = function (input, options) {
        if (arguments.length === 1 && typeof arguments[0] == "string") {
            var id = arguments[0];

            if (instances.hasOwnProperty(id)) {
                return instances[id];
            } else {
                alert("無此物件")
            }
        } else {
            var self = input;
            var $self = $(input);
            var selfID = input.id;
            var beforeColor = $self.css("color");
            var beforeTextDecoration = $self.css("text-decoration");

            var TextAttribute = function TextAttribute(color, textdecoration){
                this.color = color;
                this.textdecoration = textdecoration.split(" ")[0];
            }

            var beforeAttribute = new TextAttribute(beforeColor, beforeTextDecoration);
            var AfterAttribute = new TextAttribute(options.color , options.textdecoration);

            $self.bind("mouseover", function(){
                if (AfterAttribute.color){
                    $self.css("color" , AfterAttribute.color);
                };

                if (AfterAttribute.textdecoration){
                    $self.css("text-decoration" , AfterAttribute.textdecoration);
                };

                var tooltipLeft = $self.offset().left;
                var selfHeight = $self.height();
                var tooltipTop = $self.offset().top - selfHeight - 15 < 0 ? 0 : $self.offset().top - selfHeight - 15;
                $("body").append("<div id=" + selfID + "_box class='tooltip' style='top:" + tooltipTop + "; left:" + tooltipLeft + ";'>" + options.text + "</div> " );

                $self.trigger("beforeMouseover");
            });

            $self.bind("mouseout", function(){
                $self.css("color" , beforeAttribute.color);
                $self.css("text-decoration" , beforeAttribute.textdecoration);
                $("#" + selfID + "_box").remove();

                $self.trigger("afterMouseout");
            });

            self.mouseoverEvent = function(callback){
                if (typeof callback === "function"){
                    $self.bind("beforeMouseover", function(){ callback(); });
                }
            }

            self.changeColor = function(color){
                $(self).css("color", color);
                beforeAttribute.color = color;
            }

        }

        instances[input.id] = self;
    };

    // Set Defaults 
    $.tooltip.defaults = {
        color : "blue",
        textdecoration : "underline",
        text : ""
    };
})(jQuery);
