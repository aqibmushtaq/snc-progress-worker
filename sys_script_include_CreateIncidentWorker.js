var CreateIncidentWorker = Class.create();
CreateIncidentWorker.prototype = {
    initialize: function() {
    },
    
    start: function(totalIncidents, prefix) {
        // (1) Get the execution tracker and start it with the correct max progress
        var tracker = SNC.GlideExecutionTracker.getLastRunning();
        tracker.setSourceTable("incident");
        tracker.run();
        tracker.setMaxProgressValue(totalIncidents);
        
        // (2) Create the incidents and update status
        var ids = [];
        for (var i = 0; i < totalIncidents; i++) {
            var gr = new GlideRecord("incident");
            var incidentNumber = i + 1;
            var shortDescription = prefix + " " + incidentNumber;
            gr.setValue("short_description", shortDescription);
            var id = gr.insert();
            if (id)
                ids.push(id);
            tracker.incrementProgressValue();
            var progressMsg = gs.getMessage("Created incident {0} of {1}", [incidentNumber+"", totalIncidents]);
            tracker.updateDetailMessage(progressMsg);
        }
        
        // (3) Update execution tracker result
        var completeMsg = gs.getMessage("Completed incident creation, {0} incidents created out of {1}", [ids.length+"", totalIncidents]);
        tracker.updateDetailMessage(completeMsg);
        if (ids.length == totalIncidents)
            tracker.success(gs.getMessage("The incident creation is complete"));
        else
            tracker.fail(gs.getMessage("The incident creation is complete with failures"));
        
        // (4) Generate a URL to take the user to the newly created incidents
        var gu = new GlideURL("incident_list.do");
        gu.set('sysparm_query', 'sys_idIN' + ids);
        var result = {};
		// Post URL in tracker object which is passed to the client
        result.url_new_incidents = gu.toString(); 
        tracker.updateResult(result);
    },
    
    type: 'CreateIncidentWorker'
};