define(function(require) {
    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var moment = require("moment");

    var LoNo = {};

    _.extend(LoNo, Backbone.Events);

    // Utility Id
    function getNextId() {
        var nextid = JSON.stringify(LoNo.nextId);
        var s = JSON.stringify(++(LoNo.nextId));

        localStorage.setItem(LoNo.nextIdPath, s);

        return nextid;
    }
    // Utility NextDate
    function getNextDate(milliseconds , repeat) {

        var m = moment(milliseconds).subtract('seconds' , 1);

        switch(typeof(repeat)){
            case 'string':
                if(repeat == 'daily')
                    while(m.isBefore(moment()))
                        m.add('days', 1);
                else
                    m = undefined;
                break;

            case 'number':
                while(m.isBefore(moment()))
                    m.add('minutes', repeat);
                break;

            case 'undefined':
                if (m.isBefore(moment()))
                    m = undefined;
                break;

            default:
                m = undefined;
        }

        if(m)
            return m.add('seconds' , 1).valueOf();

    }


    function setJson(id , json){
        localStorage.setItem('LoNo-'+id , JSON.stringify(json));
    }

    function getJson(id ){
        return JSON.parse( localStorage.getItem('LoNo-'+id));
    }

    function removeJson( id ){
        localStorage.removeItem('LoNo-'+id);
    }


    // Initialize-START
    LoNo.initialize = function(username) {

        this.username = username;
        this.nextIdPath ='LoNo-nextId';
        this.frozenPath ='LoNo-' + this.username +'-frozen';
        this.activePath ='LoNo-Active';
        this.toBeCanceled = [];
        this.toBeFrozen = [];
        this.active = [];

        // Set localStorage environment

        var nextid = localStorage.getItem(this.nextIdPath);
        var toBeFrozen = localStorage.getItem(this.frozenPath);
        var active = localStorage.getItem(this.activePath);

        if (nextid === null) {
            localStorage.setItem(this.nextIdPath, '1');
            this.nextId = 1;
        }
        else
            this.nextId = JSON.parse(nextid);

        if (toBeFrozen === null)
            localStorage.setItem(this.frozenPath, '[]');
        else
            if(toBeFrozen !== "[]")
                this.unfreeze();

        if(active === null)
            localStorage.setItem(this.activePath , '[]');
        else
            this.active = JSON.parse(localStorage.getItem(this.activePath));

        // ONCANCEL
        window.plugin.notification.local.oncancel= function(id){
            
            var toBeCanceled = _.contains(LoNo.toBeCanceled , id);
            if(toBeCanceled){
                LoNo.toBeCanceled = _.without(LoNo.toBeCanceled, id);
                removeJson(id);
                return;
            }
            var toBeFrozen = _.contains(LoNo.toBeFrozen , id);
            if(toBeFrozen){
                LoNo.toBeFrozen = _.without(LoNo.toBeFrozen, id);
                console.log('freeze '+id);
                var a = JSON.parse(localStorage.getItem(LoNo.frozenPath));
                a.push(id);
                localStorage.setItem(LoNo.frozenPath , JSON.stringify(a));

                return;
            }

            var json = getJson(id);

            if (json === null)
                return;

            json.now =json.date;
            var nextdate = getNextDate( json.date , json.repeat);


            if(nextdate){

                if(json.end && moment(nextdate).isAfter(moment(json.end), 'day')){
                    removeJson(id);
                    this.active = _.without(this.active , id);
                    localStorage.setItem(this.activePath, JSON.stringify(this.active));
                    LoNo.trigger('Notify', json);
                    return;
                }

                json.date = nextdate;
                console.log(new Date(nextdate));
                window.plugin.notification.local.add({
                    id:id,
                    title: json.title,
                    message: json.message,
                    date: new Date(nextdate),
                });

                setJson(id, json);
            }

            var m = moment(json.now);
            
            while(m.isBefore(moment())){
                json.now = m.valueOf();
                LoNo.trigger('Notify', json);
                m.add('minutes' , json.repeat);
            }

        };
        
        //ONTRIGGER(FOREGROUND)

        window.plugin.notification.local.ontrigger = function(id , state){
            if(state == 'foreground'){
                window.plugin.notification.local.cancel(id);
            }
        };

        //ONDEVICEREADY

        document.addEventListener('resume', this.resume);
        this.resume();
   
        return this;

    };


    //END




    LoNo.add = function(json) {

        var id;
        var date = getNextDate(json.date, json.repeat);

        if(json.end && moment(date).isAfter(moment(json.end)))
            return;

        if (json.ID)
            id = json.ID;
        else
            id = getNextId();

        if (date){
            json.date = date;
            json.ID= id;
            date = new Date(json.date);
            console.log(date);
            window.plugin.notification.local.add({
                    id:id,
                    title: json.title,
                    message: json.message,
                    date: date
            });

        
            setJson(id, json);

            if(!_.contains(this.active, id)){
                this.active.push(id);
                localStorage.setItem(this.activePath , JSON.stringify(this.active));
            }



            return id;
        }

    };


    LoNo.cancel = function(id){
        this.toBeCanceled.push(id);
        window.plugin.notification.local.cancel(id);
        this.active = _.without(this.active , id);
        localStorage.setItem(this.activePath, JSON.stringify(this.active));
    };


    LoNo.cancelAll = function(){
        window.plugin.notification.local.getScheduledIds(function(ids){
            LoNo.toBeCanceled = ids;
        });
        window.plugin.notification.local.cancelAll();
        this.active = [];
        localStorage.setItem(this.activePath,'[]');
    };

    LoNo.freeze = function(){

        LoNo.toBeFrozen = this.active;
        this.active = [];
        localStorage.setItem(this.activePath , '[]');

        for (var i = 0; i < LoNo.toBeFrozen.length; i++){
            window.plugin.notification.local.cancel(LoNo.toBeFrozen[i]);

        }

    };

    LoNo.unfreeze = function(){

        var a = localStorage.getItem(this.frozenPath);
        var ids = JSON.parse(a);

        for (var i = 0; i < ids.length; i++){
            var json = getJson(ids[i]);

            this.add(json);
        }

        localStorage.setItem(this.frozenPath, "[]");

    };

    LoNo.getTriggered = function(){

        var ids = _.filter(this.active , function(id){

            var json = getJson(id);
            var now = (new Date()).getTime();

            if (json === null)
                json = {date : now};

            return (json.date < now);
        });


        return ids;
    };

    LoNo.resume = function(){

        var ids =  this.getTriggered();

        for(var i = 0 ; i < ids.length ; i++){
            window.plugin.notification.local.cancel(ids[i]);
        }

    };



    return LoNo;

});