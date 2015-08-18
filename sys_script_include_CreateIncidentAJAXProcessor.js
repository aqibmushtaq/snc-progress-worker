var CreateIncidentAJAXProcessor = Class.create();

CreateIncidentAJAXProcessor.prototype = Object.extendsObject(AbstractAjaxProcessor, {
    
    check: function() {
        var trackerGr = new GlideRecord("sys_execution_tracker");
        trackerGr.addQuery("source_table", "incident");
        trackerGr.addQuery("state", "IN", "0,1");
        trackerGr.query();
        if (trackerGr.next())
            return trackerGr.getUniqueValue();
        return "";
    },
    
    /**
     * Start the Scripted Hierarchical Worker if one does not already exist
     */
    start: function() {
        var trackerId = this.check();
        if (trackerId)
            return trackerId;
        
        var totalIncidents = this.getParameter("sysparm_ajax_processor_total_incidents");
        var prefix = this.getParameter("sysparm_ajax_processor_prefix");
        var worker = new GlideScriptedHierarchicalWorker();
        worker.setProgressName("Creating incidents");
        worker.setScriptIncludeName("CreateIncidentWorker");
        worker.setScriptIncludeMethod("start");
        worker.putMethodArg("totalIncidents", totalIncidents);
        worker.putMethodArg("prefix", prefix);
        worker.setBackground(true);
        worker.start();
        
        return worker.getProgressID();
    },
    
    type: 'CreateIncidentAJAXProcessor'
});