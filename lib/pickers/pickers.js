define(function(require) {
    var $ = require("jquery");

    var Pickers={};


    function initDatePickers(el){
            var $el = $(el);

            $el.find('.datepicker').focus(function(e){
                var date = e.target.value;
                
                if (date === "")
                    date = new Date();
                else
                    date = moment(date , 'DD/MM/YYYY')._d;

                datePicker.show({mode:'date', date:date}, function(date){
                    e.target.value = moment(date).format('DD/MM/YYYY');
                    $(e.target).blur();
                });
            });

    }


    function initTimePickers(el){
            var $el = $(el);

            $el.find('.timepicker').focus(function(e){
                var date = e.target.value;
                
                if (date === "")
                    date = new Date();
                else
                    date = moment(date , 'HH:mm')._d;

                datePicker.show({mode:'time', date:date}, function(date){
                    e.target.value= moment(date).format('HH:mm');
                    $(e.target).blur();
                });
            });
    }

    Pickers.init = function(el ,type){

        switch(type){
            case 'date':
                initDatePickers(el);
                break;
            case 'time':
                initTimePickers(el);
                break;
            default:
                initDatePickers(el);
                initTimePickers(el);
        }

    };


	return Pickers;

});