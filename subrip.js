(function() {

var
strip = function(s) {
	return s.replace(/^\s+|\s+$/g, '');
},

SubRip = {
	parse: function(subRipString) {
		var
		entries,
		entry, entryIndex, entryLines, entryLinesLength, lineIndex,
		entryData, timeData, textData,
		subRipObject = new SubRipObject();

		subRipString = strip(subRipString.replace(/\r\n|\r|\n/g, '\n'));
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

			subRipObject.append(new SubRipEntryData(entryLines[0], strip(timeData[0]), strip(timeData[1]), textData));
		}

		return subRipObject;
	}
},

SubRipTimeObject = function(timeData) {
	var
	date = new Date(0),
	timeSplit = timeData.split(','),
	upperTime = timeSplit[0].split(':'),
	millis = timeSplit[1];

	date.setHours(upperTime[0]);
	date.setMinutes(upperTime[1]);
	date.setSeconds(upperTime[2]);
	date.setMilliseconds(millis);

	this.text = timeData;
	this.date = date;
};

SubRipTimeObject.prototype.toSeconds = function() {
	return this.date.getHours() * 3600 + this.date.getMinutes() * 60 + this.date.getSeconds() + this.date.getMilliseconds() / 1000;
};

SubRipTimeObject.prototype.toMilliseconds = function() {
	return this.date.getHours() * 3600000 + this.date.getMinutes() * 60000 + this.date.getSeconds() * 1000 + this.date.getMilliseconds();
};

SubRipEntryData = function(id, start, end, text) {
	this.id = id;
	this.start = new SubRipTimeObject(start);
	this.end = new SubRipTimeObject(end);
	this.text = text;
};

SubRipObject = function() {
	this.entries = [];
};

SubRipObject.prototype.append = function(subRipEntryData) {
	if (typeofsubRipEntryData instanceof SubRipEntryData) {
		this.entries.push(subRipEntryData);
	}
};

window.SubRip = SubRip;

}())