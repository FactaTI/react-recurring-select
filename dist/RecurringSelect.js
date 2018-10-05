var React = require('react');
var RulePicker = require('./RulePicker.js');
var DatePicker = require('react-datepicker');
var RuleSummary = require("./RuleSummary.js");
var moment = require('moment');
var RTabs = require('react-tabs');

var RecurringSelect = React.createClass({displayName: "RecurringSelect",
  getInitialState: function() {
    return ({
      rule: "daily",
      interval: 1,
      validations: null,
      until: moment().format('YYYY-MM-DD'),
      startTime: "10:00 AM"
    });
  },
  handleRuleChange: function(e) {
    var rule = e.target.value;
    var validations = null;
    if (rule === "weekly") validations = [];
    if (rule === "monthly (by day of week)") {
      rule = "monthly";
      validations = {1: [], 2: [], 3: [], 4: []};
    }
    if (rule === "monthly (by day of month)") {
      rule = "monthly";
      validations = [];
    }
    this.setState({
      rule: rule,
      validations: validations
    });
  },
  handleIntervalChange: function(e) {
    var interval;
    if (e.target.value != "") {
      interval = parseInt(e.target.value);
    } else {
      interval = 0;
    }
    this.setState({
      interval: interval
    });
  },
  handleValidationsChange: function(validations) {
    this.setState({
      validations: validations
    });
  },
  handleEndDateChange: function (date) {
    this.setState({
      until: date
    });
  },
  handleTimeChange: function(time) {
    this.setState({
      startTime: time
    });
  },
  handleSave: function(e) {
    var hash = this.state;
    console.log(hash.validations);
    var iceCubeHash = {};
    var start = moment(hash.startTime, "hh:mm a A");
    var minute = start.minute();
    var hour = start.hour();
    var rule_type;
    switch (hash.rule) {
      case 'daily':
                rule_type = "IceCube::DailyRule";
                break;
      case 'weekly':
                rule_type = "IceCube::WeeklyRule";
                break;
      case 'monthly':
                rule_type = "IceCube::MonthlyRule";
                break;
      case 'yearly':
                rule_type = "IceCube::YearlyRule";
                break;
    }
    var interval = hash.interval;
    var validations = hash.validations == null ? {} : hash.validations;
    var newValidations = {};
    if (Array.isArray(validations) && rule_type == "IceCube::WeeklyRule") {
      newValidations["day"] = validations
    } else if (Array.isArray(validations) && rule_type == "IceCube::MonthlyRule") {
      newValidations["day_of_month"] = validations;
    } else if (rule_type == "IceCube::MonthlyRule") {
      newValidations["day_of_week"] = validations;
    }
    newValidations["hour_of_day"] = hour;
    newValidations["minute_of_hour"] = minute;
    var until = hash.until;
    iceCubeHash["rule_type"] = rule_type;
    iceCubeHash["interval"] = interval;
    iceCubeHash["validations"] = newValidations;
    iceCubeHash["until"] = until;
    this.props.onSave(JSON.stringify(iceCubeHash));
  },
  render: function() {
    return (
      React.createElement("div", {className: "recurring-select"}, 
        React.createElement(RTabs.Tabs, null, 
          React.createElement(RTabs.TabList, null,
            React.createElement(RTabs.Tab, null, "Recurrence Rule"),
            React.createElement(RTabs.Tab, null, "Recurring Until")
          ),
          React.createElement(RTabs.TabPanel, null,
            React.createElement(RulePicker, {
              rule: this.state.rule, 
              interval: this.state.interval, 
              validations: this.state.validations, 
              onRuleChange: this.handleRuleChange, 
              onIntervalChange: this.handleIntervalChange, 
              onValidationsChange: this.handleValidationsChange}
            )
          ), 
          React.createElement(RTabs.TabPanel, null, 
            React.createElement(DatePicker, {
              className: 'date-picker',
              minDate: moment(),
              date: this.state.until,
              onChange: this.handleEndDateChange}
            )
          )
        ),
        React.createElement("hr", null), 
        React.createElement(RuleSummary, {fields: this.state}), 
        React.createElement("button", {className: "btn save", onClick: this.handleSave}, "Save")
      )
    );
  }
});

module.exports = RecurringSelect;
