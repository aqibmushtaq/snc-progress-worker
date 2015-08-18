addLoadEvent(function() {
    $("create_incidents").observe("click", function(event) {
        event.stop();
        
        // (1) A GlideModal is created referring to simple_progress_viewer
        var dd = new GlideModal("simple_progress_viewer", false, "40em", "10.5em");
        
        var map = getMessages(["Creating incidents", "Close", "List new incidents"]);
        dd.setTitle(map["Creating incidents"]);
        
        var totalIncidents = $("total").value;
        var prefix = $("prefix").value;
        
        // (2) We set the ajax script with sysparm_ajax_processor and the parameters 
        //     all start with sysparm_ajax_processor following their name
        dd.setPreference("sysparm_ajax_processor_total_incidents", totalIncidents);
        dd.setPreference("sysparm_ajax_processor_prefix", prefix);
        dd.setPreference("sysparm_ajax_processor", 'CreateIncidentAJAXProcessor');
        
        dd.setPreference("sysparm_renderer_progress_title", map["Creating incidents"]);
        
        // (3) Specify the buttons to display on completion by, all buttons are prefixed 
        //     with sysparm_button
        dd.setPreference("sysparm_button_new_incidents", map["List new incidents"]);
        dd.setPreference("sysparm_button_close", map["Close"]);
        
        // (4) An event listener is added on executionComplete which is called 
        //     when the progress worker is completed. A tracker object is 
        //     passed to the event listener which contains a map of values  
        //     which you will see in the CreateIncidentWorker Script Include below.
        dd.on("executionComplete", function(trackerObj) {
            // (5) Event listeners are attached to the buttons
            var newIncidentsBtn = $("sysparm_button_new_incidents");
            if (newIncidentsBtn) {
                newIncidentsBtn.on('click', function() {
                    location.href = trackerObj.result.url_new_incidents;
                });
            }
            var closeBtn = $("sysparm_button_close");
            if (closeBtn) {
                closeBtn.on('click', function() {
                    dd.destroy();
                });
            }
            
        });
        
        dd.render();
    });
});