;(function($){
    var $scrollLoading;

    $.fn.scrollLoading = function(settings){
        return this.each(function(){
            $scrollLoading.init($(this), settings);
        });
    };

    $scrollLoading = $.scrollLoading = {
        more: true,

        init: function(outer, settings) {
            // objects
            this.outer = outer;
            this.appendTo = settings.appendTo;
            this.judgeBy = settings.appendTo || this.appendTo;
            this.ratio = settings.ratio || 0.9;
            // ajax settings
            this.ajaxData = settings.ajaxData || {};

            // overwrite datType
            if ('undefined' === typeof this.ajaxData.dataType || !$.inArray(this.ajaxData.dataType, ('html', 'json'))) {
                this.ajaxData.dataType = 'html';
            }

            // overwrite success callback function
            this.tmp_success = this.ajaxData.success;
            this.ajaxData.success = function(ret) {
                sl = $scrollLoading;
                sl.resultHandler(ret);

                // 若需要有更新 data 的動作要寫在 success 裡
                if ('function' === typeof sl.tmp_success) {
                    sl.tmp_success(ret);
                }

                // 檢查版面高度夠不夠讓捲軸出現
                if (sl.more) {
                    sl.checkGetMore();
                }
            };

            this.outer.scroll(function(){
                var sl = $scrollLoading;
                var scrollBottom = sl.outer.scrollTop() + $(window).height();
                if ((true === sl.more) && (scrollBottom / sl.judgeBy.height() >= sl.ratio)) {
                    sl.more = false;
                    sl.sendRequest();
                }
            });

            // 檢查版面高度夠不夠讓捲軸出現
            this.checkGetMore();
        },

        sendRequest: function() {
            $.ajax(this.ajaxData);
        },

        checkGetMore: function() {
            if (this.judgeBy.height() < this.outer.height() * 2) {
                this.more = false;
                this.sendRequest();
            }
        },

        resultHandler: function(ret) {
            var content = '';
            if ('html' === this.ajaxData.dataType) {
                content = ret;
            } else if ('json' === this.ajaxData.dataType) {
                if (true === ret.error) {
                    content = '';
                } else if ('undefined' !== typeof ret.content) {
                    content = ret.content;
                }
            }

            if ('' !== content) {
                this.appendTo.append(content);
                this.more = true;
            }
        }
    };

})(jQuery);
