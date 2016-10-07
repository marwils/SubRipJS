/**
 * SubRipJS
 * Version: 1.0
 * Author: Martin Wilsdorf (de.marwils@gmail.com)
 *
 * SubRipJS is a  simple JavaScript based SRT (SubRip) file format parser and
 * creator (see https://en.wikipedia.org/wiki/SubRip).
 */

(function() {
var
trim = function(s) {
	return s.replace(/^\s+|\s+$/g, '');
},

SubRip = function() {
	this.entries = [];
},

SubRipTimeObject = function(timeData) {
	var
	date = new Date(0),
	timeSplit = timeData.split(','),
	timeHigh = timeSplit[0].split(':'),
	millis = timeSplit[1];

	date.setHours(timeHigh[0]);
	date.setMinutes(timeHigh[1]);
	date.setSeconds(timeHigh[2]);
	date.setMilliseconds(millis);

	this.text = timeData;
	this.time = date;
};

SubRip.prototype.append = function() {
	if (arguments.length === 0) {
		return;
	}
	var index;
	if (arguments.length === 1) {
		if (arguments[0] instanceof SubRipEntryData) {
			this.entries.push(arguments[0]);
		} else if (Array.isArray(arguments[0])) {
			for (index in arguments[0]) {
				this.append(arguments[0][index]);
			}
		}
	} else if (arguments.length > 2) {
		this.append(new SubRipEntryData(arguments[0], arguments[1], arguments[2], arguments[3]))
	}
};

SubRip.prototype.toSrt = function() {
	return this.entries.join('\n\n');
};

SubRip.parse = function(subRipString) {
	var
	entries,
	entry, entryIndex, entryLines, entryLinesLength, lineIndex,
	entryData, timeData, textData,
	subRipObject = new SubRip();

	subRipString = trim(subRipString.replace(/\r\n|\r|\n/g, '\n'));
	entries = subRipString.split('\n\n');

	for (entryIndex in entries) {
		entry = entries[entryIndex];
		entryLines = entry.split('\n');

		if (entryLines.length < 2) {
			continue;
		}

		timeData = entryLines[1].split(' --> ');
		textData = entryLines[2];

		for (lineIndex = 3, entryLinesLength = entryLines.length; lineIndex < entryLinesLength; textData += '\n' + entryLines[lineIndex++]);

		subRipObject.append(new SubRipEntryData(entryLines[0], trim(timeData[0]), trim(timeData[1]), textData));
	}

	return subRipObject;
};

SubRipEntryData = function(id, start, end, text) {
	this.id = parseInt(id);
	this.start = new SubRipTimeObject(start);
	this.end = new SubRipTimeObject(end);
	this.text = text;
};

SubRipEntryData.prototype.toString = function() {
	var value = [this.start.text, this.end.text].join(' --> ');
	value = [this.id, value, this.text].join('\n');
	return value;
}

SubRipTimeObject.prototype.toSeconds = function() {
	return this.time.getHours() * 3600 + this.time.getMinutes() * 60 + this.time.getSeconds() + this.time.getMilliseconds() / 1000;
};

SubRipTimeObject.prototype.toMilliseconds = function() {
	return this.time.getHours() * 3600000 + this.time.getMinutes() * 60000 + this.time.getSeconds() * 1000 + this.time.getMilliseconds();
};

// isArray() polyfill
// https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray#Compatibility
if (!Array.isArray) {
  Array.isArray = function (vArg) {
    return Object.prototype.toString.call(vArg) === "[object Array]";
  };
}

window.SubRip = SubRip;
window.SubRipEntryData = SubRipEntryData;

}())