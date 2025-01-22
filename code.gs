function doGet(e) {
  var sourceId = e.parameter.sourceId;
  if (sourceId) {
    try {
      var data = getViewLinks(sourceId);
      return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
      return ContentService.createTextOutput(JSON.stringify({ error: error.message })).setMimeType(ContentService.MimeType.JSON);
    }
  } else {
    return HtmlService.createHtmlOutputFromFile('index');
  }
}

function getViewLinks(sourceId) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(sourceId);

  if (sheet) {
    const data = sheet.getDataRange().getValues();

    const type = sheet.getRange(7, 3).getValue() ? removeEqualsSign(sheet.getRange(7, 3).getValue()) : "";
    const colorScheme = sheet.getRange(8, 3).getValue() ? removeEqualsSign(sheet.getRange(8, 3).getValue()) : "";

    const collectionTitle = data[0][2] ? removeEqualsSign(data[0][2]) : "";
    const collectionSubtitle = data[1][2] ? removeEqualsSign(data[1][2]) : "";

    const links = data.slice(1)
      .map(row => ({
        title: removeEqualsSign(row[0]),
        link: removeEqualsSign(row[1])
      }))
      .filter(item => item.title && item.link);

    const viewCountCell = sheet.getRange(4, 3);
    let viewCount = viewCountCell.getValue();
    viewCount = viewCount ? viewCount + 1 : 1;
    viewCountCell.setValue(viewCount);

    const today = new Date();
    const formattedDate = Utilities.formatDate(today, Session.getScriptTimeZone(), 'dd.MM.yyyy');
    const lastUsageDateCell = sheet.getRange(6, 3);
    lastUsageDateCell.setValue('Last view: ' + formattedDate);

    return {
      collectionTitle,
      collectionSubtitle,
      type,
      colorScheme,
      viewCount,
      links
    };
  } else {
    throw new Error(`No link collection found! (Pin: ${sourceId})`);
  }
}

function doPost(e) {
  var submittedValues = e.parameter.submittedValues;
  var code = e.parameter.code;
  var title = e.parameter.title;
  var subtitle = e.parameter.subtitle;
  var email = e.parameter.email;
  var colorscheme = e.parameter.colorscheme;
  var type = e.parameter.type;

  try {
    var result = submitLinks(submittedValues, code, email, title, subtitle, type, colorscheme);
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: error.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

function submitLinks(submittedValues, code, email, title, subtitle, type, colorscheme) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.insertSheet(code.toString());

  const pairs = submittedValues.split("\n");
  const data = [["Title", "Link"]];

  for (let i = 0; i < pairs.length; i++) {
    const [title, link] = pairs[i].split("||");
    const cleanedTitle = removeEqualsSign(title);
    const cleanedLink = removeEqualsSign(link);
    if (cleanedTitle && cleanedLink) { 
      data.push([cleanedTitle, cleanedLink]);
    }
  }

  sheet.getRange(1, 1, data.length, 2).setValues(data);
  sheet.getRange(1, 3).setValue(removeEqualsSign(title));
  sheet.getRange(2, 3).setValue(removeEqualsSign(subtitle));
  sheet.getRange(3, 3).setValue('Email: ' + removeEqualsSign(email));

  sheet.getRange(7, 3).setValue(removeEqualsSign(type));
  sheet.getRange(8, 3).setValue(removeEqualsSign(colorscheme));

  const today = new Date();
  const formattedDate = Utilities.formatDate(today, Session.getScriptTimeZone(), 'dd.MM.yyyy');
  sheet.getRange(5, 3).setValue('Created: ' + formattedDate);

  removeAllFormulas();

  sendNotificationEmail();

  return { success: true' };
}


function removeAllFormulas() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getActiveSheet();
  
  var range = sheet.getDataRange();
  var values = range.getValues();
  
  for (var i = 0; i < values.length; i++) {
    for (var j = 0; j < values[i].length; j++) {
      var cell = range.getCell(i + 1, j + 1);
      if (cell.getFormula()) {
        values[i][j] = cell.getValue(); 
      }
    }
  }
 
  range.setValues(values);
}

function removeEqualsSign(value) {
  if (typeof value === 'string' && value.startsWith('=')) {
    return value.substring(1);
  }
  return value;
}

function sendNotificationEmail() {
  const emailAddress = "info@refhoster.com";
  const subject = "New link collection has been created.";
  const body = "A new link collection has been created.";
  MailApp.sendEmail(emailAddress, subject, body);
}
