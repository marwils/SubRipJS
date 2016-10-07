# SubRipJS

SubRipJS is a  simple JavaScript based SRT (SubRip) file format parser and creator (see https://en.wikipedia.org/wiki/SubRip).

## Usage

### Parse SRT
```javascript
srtObj = SubRip.parse(srtText);
```

### Create SRT
```javascript
srtText = srtObj.toSrt();
```

### Handle entries
```javascript
console.log(srtObj.entries[0].id);    // e.g. 132
console.log(srtObj.entries[0].text);  // e.g. 'Hello Jim'
console.log(srtObj.entries[0].start); // SubRipTimeObject
console.log(srtObj.entries[0].end);   // SubRipTimeObject
```

### SubRipTimeObject
```javascript
console.log(srtObj.entries[0].start.text);             // time as string
console.log(srtObj.entries[0].start.time);             // time as Date object
console.log(srtObj.entries[0].start.toSeconds());      // time in seconds
console.log(srtObj.entries[0].start.toMilliseconds()); // time in milliseconds
```

### Add an entry
```javascript
// Adds subtitle #132 at 7min 50sec showing 'Hello Jim' for 1.5 seconds.
srtObj.append(132, '00:07:50,000', '00:07:51,500', 'Hello Jim');

// It's also possible to create a SubRipEntryData object first.
data1 = new SubRipEntryData(132, '00:07:50,000', '00:07:51,500', 'Hello Jim');
srtObj.append(data1);

// You can append an array of SubRipEntryData objects.
data2 = new SubRipEntryData(133, '00:07:52,000', '00:07:53,000', 'Good-bye!');
srtObj.append([data1, data2]);
```