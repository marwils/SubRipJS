(function() {

var
strip = function(s) {
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
	this.date = date;
};

SubRip.prototype.append = function(subRipEntryData) {
	if (subRipEntryData instanceof SubRipEntryData) {
		this.entries.push(subRipEntryData);
	}
};

SubRip.parse = function(subRipString) {
	var
	entries,
	entry, entryIndex, entryLines, entryLinesLength, lineIndex,
	entryData, timeData, textData,
	subRipObject = new SubRip();

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

window.SubRip = SubRip;

}())