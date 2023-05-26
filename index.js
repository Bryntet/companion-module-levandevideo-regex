const instance_skel = require('../../instance_skel');

class Instance extends instance_skel {
	constructor(system, id, config) {
		super(system, id, config);
		this.actions(); // export actions
	}

	updateConfig(config) {
		this.config = config;
	}

	init() {
		this.status(this.STATE_OK); // report good status
		this.init_feedbacks(); // initialize feedbacks
	}

	// Return config fields for web config
	config_fields() {
		return [];
	}

	// When module gets deleted
	destroy() {
		this.debug("destroy", this.id);
	}

	actions(system) {
		this.setActions({
			'update_feedback': {
				label: 'Update Feedback',
				callback: () => {
					this.checkFeedbacks('match_regex');
				}
			}
		});
	}

	init_feedbacks() {
		// feedbacks
		let feedbacks = {};

		feedbacks['match_regex'] = {
			label: 'Match variable against regex',
			description: 'Checks if a variable matches a provided regex',
			options: [
				{
					type: 'textwithvariables',
					label: 'Variable',
					tooltip: 'What variable to act on?',
					id: 'variable',
				},
				{
					type: 'textinput',
					label: 'Regex',
					id: 'regex',
					default: ''
				}
			],
			callback: function (feedback, bank) {
				const { variable, regex } = feedback.options;

				// Retrieve the actual variable value from the state
				let varValue = this.getVariable(variable);

				// Check if the variable matches the regex
				const regexObj = new RegExp(regex);
				if (regexObj.test(varValue)) {
					console.log("success!")
					return true;
				} else {
					console.log("BOOO")
					return false;
				}
			}
		};

		this.setFeedbackDefinitions(feedbacks);
	}
}

module.exports = Instance;
