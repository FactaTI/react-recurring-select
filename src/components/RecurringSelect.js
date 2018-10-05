var React = require('react');
var RulePicker = require('./RulePicker.js');
var DatePicker = require('react-datepicker');
var RuleSummary = require("./RuleSummary.js");
var moment = require('moment');
var RTabs = require('react-tabs');

var RecurringSelect = React.createClass({
  getInitialState: function() {
    return ({
      rule: "daily",
      interval: 1,
      validations: null,
      until: moment().format('YYYY-MM-DD'),
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
  handleSave: function(e) {
    var hash = this.state;
    console.log(hash.validations);
    var iceCubeHash = {};
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
    var until = hash.until;
    iceCubeHash["rule_type"] = rule_type;
    iceCubeHash["interval"] = interval;
    iceCubeHash["validations"] = newValidations;
    iceCubeHash["until"] = until;
    this.props.onSave(JSON.stringify(iceCubeHash));
  },
  render: function() {
    return (
      <div className="recurring-select">
        <RTabs.Tabs>
          <RTabs.TabList>
            <RTabs.Tab>Recurrence Rule</RTabs.Tab>
            <RTabs.Tab>Occurrence Time</RTabs.Tab>
            <RTabs.Tab>Occurring Until</RTabs.Tab>
          </RTabs.TabList>

          <RTabs.TabPanel>
            <RulePicker
              rule={this.state.rule}
              interval={this.state.interval}
              validations={this.state.validations}
              onRuleChange={this.handleRuleChange}
              onIntervalChange={this.handleIntervalChange}
              onValidationsChange={this.handleValidationsChange} />
          </RTabs.TabPanel>
          <RTabs.TabPanel>
            <DatePicker
              className="date-picker"
              minDate={moment()}
              date={this.state.until}
              onChange={this.handleEndDateChange}
            />
          </RTabs.TabPanel>
        </RTabs.Tabs>
        <hr></hr>
        <RuleSummary fields={this.state} />
        <button className="btn save" onClick={this.handleSave}>Save</button>
      </div>
    );
  }
});

module.exports = RecurringSelect;
