import React from 'react';

export const HandleOnChange = (e, type, stateSetter, min, max) => {
  let value = e.target.value;

  // Remove non-numeric characters (except for one dot if type is 'float')
  if (type === 'number') {
    value = value.replace(/\D/g, ''); // Remove anything that's not a number
  } else if (type === 'float') {
    value = value.replace(/[^0-9.]/g, ''); // Allow numbers and one dot
    const dotCount = (value.match(/\./g) || []).length;
    if (dotCount > 1) return; // Prevent more than one dot
  }

  let numericValue = type === 'float' ? parseFloat(value) : parseInt(value, 10);

  // Allow empty input but validate min/max range
  if (value === '' || (!isNaN(numericValue) && numericValue >= min && numericValue <= max)) {
    stateSetter(value); // Store raw value (not formatted)
  }
};

export const FormatTextWithLineBreaks = (text) => {
  // Ensure text is a string
  if (typeof text !== 'string') return null;

  // Normalize all types of line breaks and <br> tags into one consistent split point
  const lines = text.split(/(?:<br\s*\/?>|<\/br>|\r?\n)+/i); // handles <br>, </br>, \n, \r\n

  const result = [];
  let bulletItems = [];

  const isBullet = (line) => /^\s*(•|-|\d+\.)\s+/.test(line);

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed === '') return; // Skip empty lines

    if (isBullet(trimmed)) {
      bulletItems.push(trimmed);
    } else {
      if (bulletItems.length > 0) {
        result.push(
          <ul key={`ul-${index}`} style={{ paddingLeft: '20px', margin: 0 }}>
            {bulletItems.map((item, i) => (
              <li key={`li-${i}`}>{item.replace(/^\s*(•|-|\d+\.)\s+/, '')}</li>
            ))}
          </ul>
        );
        bulletItems = [];
      }

      result.push(
        <React.Fragment key={`line-${index}`}>
          {trimmed}
          <br />
        </React.Fragment>
      );
    }
  });

  if (bulletItems.length > 0) {
    result.push(
      <ul key={`ul-end`} style={{ paddingLeft: '20px', margin: 0 }}>
        {bulletItems.map((item, i) => (
          <li key={`li-end-${i}`}>{item.replace(/^\s*(•|-|\d+\.)\s+/, '')}</li>
        ))}
      </ul>
    );
  }

  return result;
};

export const truncateDescription = (description, maxLength = 40) => {
  if (!description) return '';
  return description.length > maxLength
    ? description.slice(0, maxLength).trim() + '...'
    : description;
};
