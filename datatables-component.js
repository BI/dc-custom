var $  = require('jquery');
window.jQuery = $;
var dc = require('dc'),
    datatables = require('drmonty-datatables');


module.exports = function(parent, chartGroup){

  var _chart = dc.baseMixin({});
  var _columns; 
  var _dataTable;
  var _settings;

  /**
      #### .columns({label: String, csvColumnName: String})
      Explicitly set default selection. If not set, defaults to the first item in the select options.
  
  **/
  _chart.columns = function(_) {
    if (!arguments.length) return _columns;
    _columns = _;
    return _chart;
  }

  _chart.settings = function(_) {
    if (!arguments.length) return _settings;
    _settings = _;
    return _chart;
  }

  _chart.dataTable = function() {
    return _dataTable;
  }

  _chart._doRender = function() {
    // Insert Table HTML into parent node
    _chart.root().html("");
    var table = _chart.root().append('table');
    table.attr("class", "dc-datatable")
    var headerRow = table.append('thead').append('tr');
    headerRow.selectAll('th')
      .data(_columns).enter()
        .append('th')
        .style({"text-align": function(d){return d.alignment}})
        .text(function(d){return d.label});

    //wasnt what the best way would be to pass the readers and writers from aid-explorer-dashboard
    var datatablesConfig = {
        "bDeferRender": true,
        "aaData": _chart.dimension().top(10),
        "bDestroy": true,
        "aoColumns": _columns.map(function(c){return {"mData": c.csvColumnName, "sDefaultContent": (c.defaultContent || " ")}})
    };

    $.extend(datatablesConfig, _settings);

    // Initialize jQuery DataTable
    _dataTable = $(parent + " table").dataTable(datatablesConfig);  
    //_chart._doRedraw(); 
    RefreshTable(10);   
  }

  _chart._doRedraw = function(){
    RefreshTable();
  }

  _chart.refreshTable = RefreshTable;

  function RefreshTable(_) {
    var top = (_ || Infinity);
    dc.events.trigger(function () {
      _dataTable.fnClearTable();
      _dataTable.fnAddData(_chart.dimension().top(top));
      _dataTable.fnDraw();
    });
  };

  return _chart.anchor(parent, chartGroup);
}